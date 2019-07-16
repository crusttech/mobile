import app from 'corteza-webapp-messaging/src/app'
import router from './router'
import './themes'
import './plugins'
import './mixins'

window.localStorageKeys = {
  domain: 'api.domain',
  domains: 'api.domains',
}

// Initialize config
const lsKeys = {
  domain: { k: window.localStorageKeys.domain, d: null },
  domains: { k: window.localStorageKeys.domains, d: [] },
}

// NOTE: domain object structure:
// { domain: x, config: y, }

// Check/fix localStorage's validity
for (const { k, d } of Object.values(lsKeys)) {
  if (!(k in localStorage)) {
    localStorage.setItem(k, JSON.stringify(d))
  }
}

// Check if domain is selected
const domain = localStorage.getItem(lsKeys.domain.k)
const domains = JSON.parse(localStorage.getItem(lsKeys.domains.k))
const { config } = domains.filter(d => d.domain === domain).pop() || {}

// If domain found & it's config is present, then use it; else use the base
if (domain && config) {
  Object.assign(window, config)
} else {
  window.configInvalid = true
}

// Run app
document.addEventListener('deviceready', () => {
  console.debug('device.ready')
  app({ router })
}, false)
