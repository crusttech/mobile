// This script has to be ran before the main vue script.
// It inits the config for mobile client.

const lsKeys = {
  domain: ['crust.domain', null],
  domains: ['crust.domains', []],
}

const ccKey = 'CrustConfig'
const ccBase = {
  invalid: true,
  system: {},
  messaging: {},
  crm: {},
  webapp: { auth: {}, },
}

// NOTE: domain object structure:
// { domain: x, config: y, }

// Check/fix localStorage's validity
for (const [k, d] of Object.values(lsKeys)) {
  if (!(k in localStorage)) {
    localStorage.setItem(k, JSON.stringify(d))
  }
}

// Check if domain is selected
const domain = localStorage.getItem(lsKeys.domain)
const domains = JSON.parse(localStorage.getItem(lsKeys.domains))
const { config } = domains.filter(d => d.domain === domain).pop() || {}

// If domain found & it's config is present, then use it; else use the base
if (domain && config) {
  window[ccKey] = config
} else {
  window[ccKey] = ccBase
}

// Run app
require('./base.main.js')
