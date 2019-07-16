<template>
  <the-wrap :loading="this.processing" :error="error">
    <router-view v-bind="settings"
                 :afterLogin="updateClients"
                 :afterSignup="updateClients"
                 :afterConfirmEmail="afterConfirmEmail"
                 :afterLogout="afterLogout"
                 :onExternalAuth="onExternalAuth" />
  </the-wrap>
</template>

<script>
import App from 'corteza-webapp-auth/src/views/App'
import TheWrap from 'corteza-webapp-auth/src/components/TheWrap'

export default {

  components: {
    TheWrap,
  },
  extends: App,

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  created () {
    if (process.env.CORDOVA_PLATFORM) {
      navigator.splashscreen.hide()
    }
  },

  methods: {
    onExternalAuth (url) {
      if (!url) {
        return
      }

      /* eslint-disable no-undef */
      const iab = cordova.InAppBrowser.open(url, '_blank', 'location=no,beforeload=yes,hidenavigationbuttons=yes,zoom=no')

      // If url has our token, take it and use it for exchange
      const r = /^.+[?&]token=([a-zA-Z0-9]{32}\d+).*$/
      iab.addEventListener('loadstart', ({ url }) => {
        const rr = r.exec(url)
        console.debug(url, rr)
        if (rr != null) {
          iab.close()
          this.$router.push({ name: 'auth:login', query: { token: rr[1] } })
        }
      })
    },

    afterLogout () {
      localStorage.removeItem(window.localStorageKeys.domain)
      this.$router.push({ name: 'auth:login' })
    },

    afterConfirmEmail () {
      window.setTimeout(() => {
        this.$router.push({ name: 'landing' })
      }, 3000)
    },

    updateClients () {
      // commit updated apis to the state
      this.$store.commit('channels/updateAPI', {})
      this.$store.commit('history/updateAPI', {})
      this.$store.commit('users/updateAPI', {})
      this.$store.commit('unread/updateAPI', {})
      this.$store.commit('suggestions/updateAPI', {})

      this.$SystemAPI.setJWT(this.$auth.JWT)
      this.$MessagingAPI.setJWT(this.$auth.JWT)

      this.$store.commit('channels/updateAPI', { MessagingAPI: this.$MessagingAPI })
      this.$store.commit('history/updateAPI', { MessagingAPI: this.$MessagingAPI })
      this.$store.commit('users/updateAPI', { MessagingAPI: this.$MessagingAPI, SystemAPI: this.$SystemAPI })
      this.$store.commit('unread/updateAPI', { MessagingAPI: this.$MessagingAPI })
      this.$store.commit('suggestions/updateAPI', { MessagingAPI: this.$MessagingAPI })

      this.$router.push({ name: 'landing' })
    },
  },
}
</script>
