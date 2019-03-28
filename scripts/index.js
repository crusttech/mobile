// NOTE: Remove this with actual xhr call when cores issue gets resolved.
const mockResponse = `window.CrustConfig = {
  system: {
    baseUrl: 'https://system.api.latest.crust.tech'
  },

  messaging: {
    baseUrl: 'https://messaging.api.latest.crust.tech'
  },

  crm: {
    baseUrl: 'https://crm.api.latest.crust.tech'
  },

  webapp: {
    auth: {
      adtSignOutUrl: "https://satosa.didmos.latest.crust.tech/didmos/logout/",
    },
    apps: {
      googlemaps: {
        apiKey: 'AIzaSyCDyRzziFyvGAfQbo2Ofiysgl70RU1DZnE',
      },
    },
    baseUrl: 'https://latest.crust.tech'
  },

  // BC:	
  sam: { baseUrl: 'https://messaging.api.latest.crust.tech' },
  spa: { baseUrl: 'https://latest.crust.tech' },
}`

// Config must apply to this structure.
const cfgStructure = /^return [ {}a-z0-9:',."/	]+}$/gim

// Helper to give elements some styles...
function styleElement (e, styles = {}) {
  for (const s in styles) {
    e.style[s] = styles[s]
  }
}

// Fetches & checks configs validity...
async function getConfig (domain) {
  return new Promise((resolve, reject) => {
    // // Todo; Cores issues...
    // const xhr = new XMLHttpRequest()
    // xhr.withCredentials = true
    // xhr.open("GET", `https://latest.crust.tech/config.js`, false)
    // // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.send();

    // Preprocess the config so we can use it as a json.
    try {
      let preProc = mockResponse.replace(/^window.CrustConfig = /, 'return ')
      if (!(cfgStructure.test(preProc.replace(/\n/g, '')))) {
        throw 'Config structure invalid!'
      }

      resolve({ domain, config: (new Function(preProc))(), store: true })
    } catch (e) {
      reject(e)
    }
  })
}

function finishConfig ({domain, config, store = false, resolve, lsKeys, root}) {
  if (store) {
    const domains = JSON.parse(localStorage.getItem(lsKeys.domains) || '[]').filter(d => d.domain !== domain)
    domains.push({ domain, config })
    localStorage.setItem(lsKeys.domains, JSON.stringify(domains))
  }

  localStorage.setItem(lsKeys.domain, domain)
  root.parentNode.removeChild(root)
  resolve({ domain, config })
}

window.crustHybrid = {
  // Overlay a popup, where user can select or enter new domain for config
  async configureClient ({ message = 'Configure client', lsKeys = { domain: 'crust.domain', domains: 'crust.domains' } } = {}) {
    return new Promise((resolve, reject) => {
      const target = document.getElementsByTagName('body')[0]

      // Popup light box
      const pp = document.createElement('div')
      styleElement(pp, {
        'position': 'absolute',
        'left': 0,
        'right': 0,
        'top': 0,
        'bottom': 0,
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'background-color': '#1e1e1e',
        'z-index': '10000',
      })

      // Popup content box
      const box = document.createElement('div')
      const t = document.createElement('h3')
      const err = document.createElement('p')
      t.textContent = message
      pp.appendChild(box)
      box.appendChild(t)
      styleElement(box, {
        'max-width': '500px',
        'padding': '10px 20px',
        'background-color': '#fafafa',
        'box-shadow': '0 0 10px #ffffff',
        'border-radius': '4px',
        'position': 'relative',
      })
      styleElement(err, {
        color: 'red',
      })

      // Existing config selector
      const domains = JSON.parse(localStorage.getItem(lsKeys.domains) || '[]')
      if (domains.length) {
        const list = document.createElement('ul')
        box.appendChild(list)
        for (const d of domains) {
          const li = document.createElement('li')
          li.textContent = d.domain
          li.onclick = (e) => finishConfig({ ...d, resolve, lsKeys, root: pp })
          list.appendChild(li)
        }
      }

      // New config input & validation
      const newInput = document.createElement('input')
      const submit = document.createElement('button')
      newInput.type = 'text'
      newInput.placeholder = `www.example.com`
      submit.textContent = 'Go'
      box.appendChild(newInput)
      box.appendChild(submit)
      submit.onclick = (e) => getConfig(newInput.value).then((e) => {
        finishConfig({ ...e, resolve, lsKeys, root: pp })
      }).catch((e) => {
        // TODO: Improve this err msg
        err.textContent = e
        box.appendChild(err)
      })

      // Cancel button
      const close = document.createElement('button')
      close.textContent = 'x'
      box.appendChild(close)
      close.onclick = () => {
        // Close & reject
        pp.parentNode.removeChild(pp)
        reject({ canceled: true })
      }
      styleElement(close, {
        'position': 'absolute',
        'top': 0,
        'right': 0,
        'top': '0px',
        'right': '0px',
        'margin': '5px',
        'border': '1px solid red',
        'color': 'red',
        'border-radius': '100%',
        'width': '30px',
        'height': '30px',
        'background-color': 'unset',
      })

      target.appendChild(pp)
    })
  }
}
