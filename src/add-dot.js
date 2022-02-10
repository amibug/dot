'use strict'

var fs = require('fs')
var path = require('path')
var sutil = require('../lib/sutil')
var sizzle = require('../lib/sizzle')
var processorDefalut = require('./processor/index')
var isRepeat = require('./is-repeat')

module.exports = function (config) {
  const ctx = this
  const filter = config.filter || []
  const workPath = config.workPath ? path.resolve(this.app.dir, config.workPath) : this.app.dir
  const template = config.template || ''
  const processorUser = config.processor || {}
  const processor = Object.assign(processorDefalut, processorUser)

  sutil.readDir(workPath, function (file) {
    var html = fs.readFileSync(file, {
      encoding: 'utf8'
    })
    filter.forEach(function (item) {
      const rtmatch = new RegExp('{{([\\S\\s]*?)}}', 'g')
      const patternTemplate = template.replace(rtmatch, '[^\\"]+')
      if (config.isReplace) {
        const pattern = sizzle(item)
        if (!pattern || !Array.isArray(pattern)) {
          ctx.logger.error('暂不支持此元素过滤器：' + item)
          return
        }
        const rmatch = new RegExp(pattern[0], 'g')
        html = html.replace(rmatch, function (m, $1, $2) {
          ctx.logger.info(file + ' exec dom-dot injected')
          const dot = template.replace(rtmatch, function (m, $1) {
            if (m) {
              const pkey = $1
              if (processor[pkey]) {
                return processor[pkey].call(ctx, config)
              } else {
                return m
              }
            } else {
              return m
            }
          })
          return dot
        })
      } else {
        const pattern = sizzle(item)
        if (!pattern || !Array.isArray(pattern)) {
          ctx.logger.error('暂不支持此元素过滤器：' + item)
          return
        }
        const rmatch = new RegExp('(' + pattern[0] + '(?!\\s*' + patternTemplate + '))', 'g')
        const rvalue = new RegExp(pattern[1])
        html = html.replace(rmatch, function (m, $1, $2) {
          if (rvalue.test($2)) {
            ctx.logger.info(file + ' exec dom-dot injected')
            const dot = template.replace(rtmatch, function (m, $1) {
              if (m) {
                const pkey = $1
                if (processor[pkey]) {
                  return processor[pkey].call(ctx, config)
                } else {
                  return m
                }
              } else {
                return m
              }
            })
            return $1 + ' ' + dot
          } else {
            return $1
          }
        })
      }
    })
    fs.writeFileSync(file, html)
  })

  isRepeat.call(ctx, config)
}
