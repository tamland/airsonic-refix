import { defineStore } from 'pinia'
import jp from 'jsonpath'
import { cloneDeep } from 'lodash-es'
import { config } from '@/shared/config'

export interface Theme {
  primary?: string
  secondary?: string
  text_body?: string
  text_muted?: string
  background0?: string
  background1?: string
  background2?: string
  icons?: string
  hover?: string
  btn_text?: string
}

export const enums = {
  menu: ['discover', 'playing', 'albums', 'artists', 'genres', 'playlists', 'favourites', 'podcasts', 'radio', 'files'],
  themes: {
    Default: {},
    'Dark Red': { primary: '#b72324', secondary: '#500606', icons: '#c93939' },
    'Dark Green': { primary: '#2cb723', secondary: '#115006', icons: '#4fc939' },
    'Dark Lime': { primary: '#8cb723', secondary: '#3e5006', icons: '#acc939' },
    'Dark Yellow': { primary: '#b7b223', secondary: '#4f5006', icons: '#c9c539' },

    'Light Blue': { primary: '#008be7', secondary: '#9caabd', text_body: '#3e3e3e', text_muted: '#727272', icons: '#3074c9', hover: '#0000000b', background0: '#e1e1e1', background1: '#d3d3d3', background2: '#bfbfbf', },
    'Light Red': { primary: '#b72323', secondary: '#500606', text_body: '#3e3e3e', text_muted: '#727272', icons: '#c93939', hover: '#0000000b', background0: '#e1e1e1', background1: '#d3d3d3', background2: '#bfbfbf', },
    'Light Green': { primary: '#2cb723', secondary: '#115006', text_body: '#3e3e3e', text_muted: '#727272', icons: '#4fc939', hover: '#0000000b', background0: '#e1e1e1', background1: '#d3d3d3', background2: '#bfbfbf', },

  } as {[key: string]: Theme},
  theme_default: { primary: '#09f', secondary: '#2e2e2e', text_body: '#ccc', text_muted: '#999', icons: '#999', hover: '#ffffff1a', background0: '#000000', background1: '#141414', background2: '#2e2e2e', btn_text: '#fff' } as Theme,
}

const DefaultSettings = {
  ui: {
    menu: {
      list: ['discover', 'playing', 'albums', 'artists', 'genres', 'playlists', 'favourites', 'podcasts', 'radio', 'files'],
      playlists: true,
    },
    theme: {},
    root: 'discover',
    return_to: '',
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => {
    let settings = cloneDeep(DefaultSettings)

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
      const settings = cloneDeep(this.settings)
      jp.value(settings, `$.${path}`, value)
      this.settings = settings
      window.localStorage.setItem('client_settings', JSON.stringify(this.settings))
    },
    includes(path: string, value: any) {
      const pv = jp.value(this.settings, `$.${path}`)
      return Array.isArray(pv) ? pv.includes(value) : false
    },
    reset() {
      this.settings = cloneDeep(DefaultSettings)
      window.localStorage.setItem('client_settings', JSON.stringify(this.settings))
    }
  }
})
