import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useMainStore = defineStore('main', {
  state: () => ({
    isLoggedIn: false,
    username: null as null | string,
    server: null as null | string,
    error: null as null | Error,
    menuVisible: false,
    artistAlbumSortOrder: useLocalStorage<'desc' | 'asc'>('settings.artistAlbumSortOrder', 'desc')
  }),
  actions: {
    setError(error: Error) {
      this.error = error
    },
    clearError() {
      this.error = null
    },
    setLoginSuccess(username: string, server: string) {
      this.isLoggedIn = true
      this.username = username
      this.server = server
    },
    showMenu() {
      this.menuVisible = true
    },
    hideMenu() {
      this.menuVisible = false
    },
    toggleArtistAlbumSortOrder() {
      this.artistAlbumSortOrder = this.artistAlbumSortOrder === 'asc' ? 'desc' : 'asc'
    }
  },
})
