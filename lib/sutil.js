var crypto = require('crypto')
var fs = require('fs')

module.exports = {
  genRandom: function (length) {
    length = length || 8
    var buf = crypto.randomBytes(32)
    return buf.toString('hex').substring(0, length)
  },
  readDir: function (dir, cb) {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const p = dir + '/' + file
      var stat = fs.lstatSync(p)
      if (stat.isFile()) {
        if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
          cb(p)
        }
      } else if (stat.isDirectory()) {
        this.readDir(p, cb)
      }
    })
  }
}
