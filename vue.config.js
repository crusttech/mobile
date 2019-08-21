const wpm = require('webpack-merge')
const buildVueConfig = require('corteza-webapp-messaging/vue.config-builder')

const base = buildVueConfig({
  appName: 'messaging-hybrid',
  appLabel: 'Crust Messaging',
  theme: 'crust-hybrid-base',
  packageAlias: 'crust-hybrid-messaging',
})

module.exports = wpm(base, {
  publicPath: process.env.CORDOVA_PLATFORM ? '' : '/',
  pluginOptions: {
    cordovaPath: 'src-cordova',
  },
})
