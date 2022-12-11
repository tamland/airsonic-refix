import '@/style/main.scss'
import Vue from 'vue'
import { VueConstructor } from 'vue/types/vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import App from '@/app/App.vue'
import { components, formatDuration } from '@/shared/components'
import { setupRouter } from '@/shared/router'
import { setupStore } from '@/shared/store'
import { API } from '@/shared/api'
import { AuthService } from '@/auth/service'
import { setupAudio } from './player/store'

declare module 'vue/types/vue' {
  interface Vue {
    config: VueConstructor['config']
    component: (k: string, v: any) => void
    mount: (arg: string) => void
    $auth: AuthService
    $api: API
    $formatDuration: typeof formatDuration
  }
  interface VueConfiguration {
    globalProperties: Vue
  }
}

const createApp = (args: any) => {
  const vm = new Vue(args)
  vm.config = Vue.config
  vm.config.globalProperties = Vue.prototype
  vm.mount = vm.$mount
  vm.component = (key: string, value: any) => {
    Vue.component(key, value)
  }
  return vm
}

Vue.use(Vuex)
Vue.use(Router)

const authService = new AuthService()
const api = new API(authService)
const router = setupRouter(authService)
const store = setupStore(authService, api)
setupAudio(store, api)

router.beforeEach((to, from, next) => {
  store.commit('clearError')
  next()
})

const app = createApp({
  router,
  store,
  render: (h: any) => h(App),
})

app.config.globalProperties.$auth = authService
app.config.globalProperties.$api = api
app.config.globalProperties.$formatDuration = formatDuration

app.config.errorHandler = (err: Error) => {
  // eslint-disable-next-line
  console.error(err)
  store.commit('setError', err)
}

Object.entries(components).forEach(([key, value]) => {
  app.component(key, value)
})

app.mount('#app')
