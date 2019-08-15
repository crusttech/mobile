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
  configureWebpack: {
    resolve: {
      alias: {
        vue$: `corteza-webapp-messaging/node_modules/vue/dist/vue.esm.js`,
        i18next$: `corteza-webapp-messaging/node_modules/i18next`,
      },
    },
  },
})
