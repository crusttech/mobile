const buildVueConfig = require('corteza-webapp-messaging/vue.config-builder')

module.exports = buildVueConfig({
  appName: 'messaging-hybrid',
  appLabel: 'Crust Messaging',
  theme: 'crust-hybrid-base',
  packageAlias: 'crust-hybrid-messaging',
  publicPath: process.env.CORDOVA_PLATFORM ? '' : '/',
  alias: {
    vue$: `corteza-webapp-messaging/node_modules/vue/dist/vue.esm.js`,
    i18next$: `corteza-webapp-messaging/node_modules/i18next`,
  },
  pluginOptions: {
    cordovaPath: 'src-cordova',
  },
})
