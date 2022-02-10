'use strict'

var fs = require('fs')
var path = require('path')
var sutil = require('../lib/sutil')

module.exports = function (config) {
  const dotMap = {}
  const workPath = config.workPath ? path.resolve(this.app.dir, config.workPath) : this.app.dir
  const template = config.template || ''

  sutil.readDir(workPath, function (file) {
    var html = fs.readFileSync(file, {
      encoding: 'utf8'
    })

    const rtmatch = new RegExp('{{([\\S\\s]*?)}}', 'g')
    const patternTemplate = template.replace(rtmatch, '[^\\"]+')
    const rmatch = new RegExp(patternTemplate, 'g')
    var dot = null
    const lineHtmls = html.split(/\r|\n|\r\n/)
    lineHtmls.forEach((lineHtml, idx) => {
      while ((dot = rmatch.exec(lineHtml)) != null) {
        if (!dotMap[dot]) {
          dotMap[dot] = []
        }
        dotMap[dot].push([file, idx + 1, dot.index])
      }
    })
  })

  const keys = Object.keys(dotMap)
  keys.forEach((key) => {
    if (dotMap[key].length > 1) {
      this.logger.error('********* ' + key + ' 存在重复')
      dotMap[key].forEach((info) => {
        this.logger.error('    at ' + info[0] + ' ' + info[1] + ':' + info[2])
      })
      this.logger.error('*********')
    }
  })
}
