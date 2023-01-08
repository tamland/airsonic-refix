import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    isLoggedIn: false,
    username: null as null | string,
    server: null as null | string,
    menuVisible: false,
    error: null as null | Error,
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
  },
})
