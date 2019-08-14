import app from 'corteza-webapp-messaging/src/app'
import router from './router'
import i18n from './i18n'
import './themes'
import './plugins'
import './mixins'
import './components'

app({ router })
// Updates to existing instance must happen after
// we initialize the app itself.
i18n()
