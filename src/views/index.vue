<template>
  <div class="h-100">
    <div class="bootstrap-allowed">
      <transition
        @after-enter="onAfterEnter"
        name="swipe">

          <div
            v-show="msg"
            class="hybrid-notifications w-100">

            <b-alert
              :variant="variant"
              show>
              {{ msg }}
            </b-alert>
          </div>
      </transition>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
let th = null

export default {
  data () {
    return {
      variant: null,
      msg: null,
      deviceOnline: false,
    }
  },

  // i18nOptions: {
  //   namespaces: [ 'messaging_mobile' ],
  // },

  beforeCreate () {
    this.$nextTick(() => {
      document.addEventListener('online', this.onOnline, false)
      document.addEventListener('offline', this.onOffline, false)
    })
  },

  destroyed () {
    document.removeEventListener('online', this.onOnline, false)
    document.removeEventListener('offline', this.onOffline, false)
  },

  methods: {
    showNotification ({ variant, msg }) {
      this.msg = msg
      this.variant = variant
      this.setTimeout()
    },

    setTimeout () {
      if (th) {
        clearTimeout(th)
        th = null
      }
      th = setTimeout(() => {
        this.msg = null
        th = null
      }, 3000)
    },

    onAfterEnter (e) {
      this.setTimeout()
    },

    onOnline (e) {
      console.debug('system.event', e)
      this.wake()
      if (!this.deviceOnline) {
        this.showNotification({ variant: 'success', msg: this.$t('messaging_mobile:notification.device.online') })
      }
      this.deviceOnline = true
    },
    onOffline (e) {
      console.debug('system.event', e)
      this.showNotification({ variant: 'danger', msg: this.$t('messaging_mobile:notification.device.offline') })
      this.deviceOnline = false
    },

    // app woke up; check network & state
    wake () {
      if (this.$ws && this.$ws.conn) {
        this.$ws.conn.reconnect()
      }
      this.$root.$emit('wake')
    },
  },
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}
.hybrid-notifications {
  position: fixed;
  z-index: 100000;
  transition: transform .4s;
}
.swipe-enter-to, .swipe-leave {
  transform: translateY(0);
}
.swipe-leave-to, .swipe-enter {
  transform: translateY(-100%);
}

</style>
