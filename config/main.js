// This script has to be ran before the main vue script.
// It inits the config for mobile client.

const lsKeys = {
  domain: { k: 'crust.domain', d: null },
  domains: { k: 'crust.domains', d: [] },
}

const ccBase = {
  invalid: true,
  CrustSystemAPI: '',
  CrustMessagingAPI: '',
  CrustCrmAPI: '',
}

// NOTE: domain object structure:
// { domain: x, config: y, }

// Check/fix localStorage's validity
for (const {k, d} of Object.values(lsKeys)) {
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
  Object.assign(window, ccBase)
}

// Run app
require('./base.main.js')
