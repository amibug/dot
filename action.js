'use strict'
// var fs = require('fs')
var log = require('./src/index')

module.exports = {
  // TODO 请添加/替换其它的 ACTION (支持generatorFunction)
  * dot (args, opts) {
    this.logger.info('=====================================================================')
    this.logger.info('action dot exec start')
    // var configs = JSON.parse(fs.readFileSync(this.app.dir + '/dot-config.js', 'utf8'))
    const configs = require(this.app.dir + '/dot-config.js')
    if (!configs) {
      this.logger.error('应用缺少dot-config.js配置文件')
      return
    }
    // batch dot
    if (Array.isArray(configs)) {
      configs.forEach((config) => {
        log.addDot.call(this, config)
      })
    } else {
      log.addDot.call(this, configs)
    }

    this.logger.info('action dot exec end')
    this.logger.info('=====================================================================')
  }
}
