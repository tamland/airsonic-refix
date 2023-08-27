import { VueConstructor } from 'vue/types/vue'
import Vue from 'vue'

export interface App<T = any> {
  config: VueConstructor['config'] & {globalProperties: any}
  // eslint-disable-next-line no-use-before-define
  use(plugin: PluginObject<T>, options?: T): this
  component: VueConstructor['component']
  provide<T>(key: symbol | string, value: T): this
  mount: Vue['$mount']
  // directive(name: string): Directive | undefined
  // directive(name: string, directive: Directive): this
  // unmount: Vue['$destroy']
}

export interface PluginObject<T> {
  install: (app: App<T>, options?: T) => void
}

export const createApp = (component: any, options: any): App => {
  const provide: Record<any, any> = {}
  let vm = undefined as undefined | Vue
  return {
    use<T>(plugin: PluginObject<T>, options?: T) {
      (plugin as any).install(this, options)
      return this
    },
    config: Object.assign(
      Vue.config,
      { globalProperties: Vue.prototype }
    ),
    component: Vue.component.bind(Vue),
    provide<T>(key: symbol | string, value: T) {
      provide[key as any] = value
      return this
    },
    mount: (el, hydrating) => {
      if (!vm) {
        vm = new Vue({
          ...options,
          provide,
          render: (h: any) => h(component),
        })
        vm.$mount(el, hydrating)
      }
      return vm
    }
  }
}
