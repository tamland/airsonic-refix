import { defineStore } from 'pinia'
import jp from 'jsonpath'

import { config } from '@/shared/config'
import { Store } from 'vuex'

export const enums = {
  menu: ['discover', 'playing', 'albums', 'artists', 'genres', 'playlists', 'favourites', 'podcasts', 'radio', 'files'],
}

const DefaultSettings = {
  ui: {
    menu: {
      list: ['discover', 'playing', 'albums', 'artists', 'genres', 'playlists', 'favourites', 'podcasts', 'radio', 'files'],
      playlists: true,
    },
    theme: {
      primary: '#09f',
      secondary: '#2e2e2e',
      danger: '#ff4141',
    },
    root: 'discover',
    return_to: '',
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => {
    let settings = JSON.parse(JSON.stringify(DefaultSettings))

    try {
      settings = { ...settings, ...JSON.parse(config.settingsEnv || 'null') }
    } catch (e) {}

    try {
      settings = { ...settings, ...JSON.parse(window.localStorage.getItem('client_settings') || 'null') }
    } catch (e) {}

    return { settings }
  },
  actions: {
    get(path: string) {
      return jp.value(this.settings, `$.${path}`)
    },
    set(path: string, value: any) {
      const settings = JSON.parse(JSON.stringify(this.settings))
      jp.value(settings, `$.${path}`, value)
      this.settings = settings
      window.localStorage.setItem('client_settings', JSON.stringify(this.settings))
    },
    includes(path: string, value: any) {
      const pv = jp.value(this.settings, `$.${path}`)
      return Array.isArray(pv) ? pv.includes(value) : false
    },
    reset() {
      this.settings = JSON.parse(JSON.stringify(DefaultSettings))
    }
  },
  getters: {
    theme: (store) => {
      return jp.value(store, '$.ui.theme')
    }
  },
})
