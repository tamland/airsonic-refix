import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import '@/style/main.scss'
import '@/shared/components'
import '@/shared/filters'
import App from '@/app/App.vue'
import { setupRouter } from '@/shared/router'
import { setupStore } from '@/shared/store'
import { API } from '@/shared/api'
import { AuthService } from '@/auth/service'
import { setupAudio } from './player/store'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: AuthService
    $api: API
  }
}

Vue.config.productionTip = false
Vue.use(Router)
Vue.use(Vuex)
Vue.use(BootstrapVue)

const authService = new AuthService()
const api = new API(authService)
const router = setupRouter(authService)
const store = setupStore(authService, api)
setupAudio(store)

Vue.prototype.$auth = authService
Vue.prototype.$api = api

Vue.config.errorHandler = (err) => {
  // eslint-disable-next-line
  console.error(err)
  store.commit('setError', err)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
