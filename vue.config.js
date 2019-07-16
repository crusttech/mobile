const buildVueConfig = require('corteza-webapp-messaging/vue.config-builder')

module.exports = buildVueConfig({
  appName: 'messaging-hybrid',
  appLabel: 'Crust Messaging',
  theme: 'crust-hybrid-base',
  packageAlias: 'crust-hybrid-messaging',
  publicPath: '',
  pluginOptions: {
    cordovaPath: 'src-cordova',
  },
})
