const merge = require('webpack-merge')
const base = require('./base.config.js')

module.exports = merge(base, {
  publicPath: '',
})
