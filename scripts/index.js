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

function generateStyle (rootID) {
  const style = document.head.appendChild(document.createElement("style"))
  style.innerHTML = `
  #${rootID} {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    height: 100vh;
    width: 100%;
    z-index: 10000;
  }
  #${rootID} .content-box {
    position: relative;
    top: calc(-50% - 100px);
    transform: translateY(75vh);
    width: 80%;
    min-width: 200px;
    max-width: 320px;
    padding: 20px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif,
  }
  #${rootID} .header-main {
    text-align: center;
  }
  #${rootID} .err-main {
    color: red;
  }
  #${rootID} .domain-list {
    margin-top: 0;
  }
  #${rootID} .domain-list li {
    margin-top: 20px;
    color: rgb(0, 0, 238);
    text-decoration: underline;
    cursor: pointer;
  }
  #${rootID} .label {
    display: block;
    text-align: left;
    color: #90A3B1;
    font-size: 14px;
  }
  #${rootID} .label-or {
    margin: 30px 0;
    text-align: center;
    width: 100%;
    opacity: 0.5;
  }
  #${rootID} .label-or:before {
    content: "\\00a0";
    border-bottom: solid 1px grey;
    min-width: 30px;
    display: inline-block;
    vertical-align: middle;
    margin: -0.5em 1em 0 1em;
    height: 0.5em;
    overflow: hidden;
  }
  #${rootID} .label-or:after {
    content: "\\00a0";
    border-bottom: solid 1px grey;
    min-width: 30px;
    display: inline-block;
    vertical-align: middle;
    margin: -0.5em 1em 0 1em;
    height: 0.5em;
    overflow: hidden;
  }
  #${rootID} .new-form {
    text-align: center;
  }
  #${rootID} .new-form .input {
    border-radius: 3px;
    width: 100%;
    height: 40px;
    padding-left: 10px;
    border: 1px solid #90A3B1;
    color: #90A3B1;
    font-size: 14px;
    font-family: "Nunito", Arial, sans-serif;
  }
  #${rootID} .new-form .submit {
    display: inline-block;
    outline-color: transparent;
    border: none;
    border-radius: 40px;
    padding: 10px 40px;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
    background: #FFCC32;
    margin: 10px 0 0 0;
  })`
  return style
}

window.crustHybrid = {
  // Overlay a popup, where user can select or enter new domain for config
  async configureClient ({ lsKeys = { domain: 'crust.domain', domains: 'crust.domains' }, labels } = {}) {
    labels = {
      'header': 'Configure client',
      'selectExisting': 'Select existing domain',
      'configureDomain': 'Set new domain',
      'configure': 'Configure',
      'domainExample': 'Example: latest.crust.tech',
      'or': 'or',
      ...(labels || {}),
    }

    return new Promise((resolve, reject) => {
      const rootID = 'c_client_config_popup'
      const target = document.getElementsByTagName('body')[0]
      generateStyle(rootID)

      // Popup light box
      const pp = document.createElement('div')
      pp.id = rootID

      // Popup content box
      const box = document.createElement('div')
      const header = document.createElement('h3')
      const err = document.createElement('p')
      box.className = 'content-box'
      header.className = 'header-main'
      err.className = 'err-main'

      header.textContent = labels.header
      pp.appendChild(box)
      box.appendChild(header)

      // Existing config selector
      const domains = JSON.parse(localStorage.getItem(lsKeys.domains) || '[]')
      if (domains.length) {
        const header = document.createElement('div')
        const list = document.createElement('ul')
        header.className = 'label'
        list.className = 'domain-list'

        header.innerHTML = `<p>${labels.selectExisting}</p>`
        box.appendChild(header)
        box.appendChild(list)
        for (const d of domains) {
          const li = document.createElement('li')
          li.textContent = d.domain
          li.onclick = (e) => finishConfig({ ...d, resolve, lsKeys, root: pp })
          list.appendChild(li)
        }

        // - or - visible only if above list is shown.
        const or = document.createElement('div')
        or.className = 'label-or'
        or.textContent = labels.or
        box.appendChild(or)
      }

      // New config input & validation
      const form = document.createElement('form')
      const label = document.createElement('label')
      const newInput = document.createElement('input')
      const submit = document.createElement('input')
      form.className = 'new-form'
      label.className = 'label'
      newInput.className = 'input'
      label.for = 'input'
      newInput.name = 'domain'
      submit.className = 'submit'

      newInput.type = 'text'
      newInput.placeholder = labels.domainExample
      label.textContent = labels.configureDomain
      submit.type = 'submit'
      submit.value = labels.configure

      form.appendChild(label)
      form.appendChild(newInput)
      form.appendChild(submit)
      box.appendChild(form)

      form.onsubmit = (e) => {
        e.preventDefault()
        getConfig(newInput.value).then((e) => {
          finishConfig({ ...e, resolve, lsKeys, root: pp })
        }).catch((e) => {
          // TODO: Improve this err msg
          err.textContent = e
          box.appendChild(err)
        })
      }

      target.appendChild(pp)
    })
  }
}
