<template>
  <the-wrap>
    <b-card-body>
      <b-card-title>{{ $t(`view.configureClient.title`) }}</b-card-title>

      <!-- pre-defined configurations -->
      <b-card-sub-title>
        {{ $t('view.configureClient.existingConfigs') }}
      </b-card-sub-title>
      <b-list-group v-if="hasDomains">
        <b-list-group-item v-for="{ domain, config } of domains"
                           :key="domain"
                           @click="finishConfig({ domain, config })">
          {{ domain }}
        </b-list-group-item>
      </b-list-group>

      <!-- new configuration -->
      <b-card-sub-title class="mt-3">
        {{ $t('view.configureClient.newConfig') }}
      </b-card-sub-title>
      <b-form @submit.prevent="attemptConfiguration">
        <div class="text-danger mb-1" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text bg-primary text-white">
              <font-awesome-icon :icon="['fas', 'globe']"></font-awesome-icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model="domain"
                type="text"
                :placeholder="$t('view.configureClient.form.domain.placeholder')"
                required />
        </b-input-group>

        <b-form-group class="mt-3 text-right">
          <b-button type="submit"
                variant="primary"
                :disabled="disabledSubmit">
            {{ $t('view.configureClient.form.submit') }}
          </b-button>
        </b-form-group>
      </b-form>
    </b-card-body>
  </the-wrap>
</template>

<script>
import TheWrap from 'corteza-webapp-auth/src/components/TheWrap'
const cfgStructureRegex = /^{[a-zA-Z0-9:.,"/]+}$/gim

export default {
  components: {
    TheWrap,
  },

  data () {
    return {
      // NOTE: Remove this with actual xhr call when cores issue gets resolved.
      mockResponse: {
        crustLatest: `{"SystemAPI":"https://api.latest.crust.tech/system","MessagingAPI":"https://api.latest.crust.tech/messaging","ComposeAPI":"https://api.latest.crust.tech/compose"}`,
        cortezaLatest: `{"SystemAPI":"https://api.latest.cortezaproject.org/system","MessagingAPI":"https://api.latest.cortezaproject.org/messaging","ComposeAPI":"https://api.latest.cortezaproject.org/compose"}`,
      },

      error: null,

      domains: [],
      domain: null,
    }
  },

  computed: {
    hasDomains () {
      return !!this.domains.length
    },

    disabledSubmit () {
      return !this.domain
    },
  },

  created () {
    this.domains = JSON.parse(localStorage.getItem(window.localStorageKeys.domains) || '[]')
  },

  methods: {
    attemptConfiguration () {
      if (!this.domain) {
        throw new Error('client.domain.missing')
      }

      const domain = this.domain.toLowerCase()
      // // @todo; Cores issues...
      // const xhr = new XMLHttpRequest()
      // xhr.withCredentials = true
      // xhr.open("GET", `https://latest.crust.tech/config.js`, false)
      // // xhr.setRequestHeader("Content-Type", "application/json");
      // xhr.send();

      // mock
      let rsp = this.mockResponse.crustLatest
      if (domain.indexOf('corteza') >= 0) {
        rsp = this.mockResponse.cortezaLatest
      }

      // validate and parse
      try {
        if (!(cfgStructureRegex.test(rsp.replace(/\n/g, '')))) {
          throw new Error('client.config.invalid')
        }

        this.finishConfig({ domain, config: JSON.parse(rsp), store: true })
      } catch (e) {
        throw new Error('client.config.error', e)
      }
    },

    finishConfig ({ domain, config, store = false }) {
      if (!config) {
        // find the required config
        config = (this.domains.find(d => d.domain === domain) || {}).config
      }

      if (!config) {
        throw new Error('client.config.notFound')
      }

      if (store) {
        let domains = this.domains.filter(d => d.domain !== domain)
          .concat({ domain, config })

        localStorage.setItem(window.localStorageKeys.domains, JSON.stringify(domains))
        this.domains = domains
      }

      localStorage.setItem(window.localStorageKeys.domain, domain)

      // update configs
      Object.assign(window, config)
      delete window.invalid

      // commit updated apis to the state
      this.$SystemAPI.baseURL = window.SystemAPI
      this.$MessagingAPI.baseURL = window.MessagingAPI

      this.$router.push({ name: 'auth:login' })
    },
  },
}
</script>
