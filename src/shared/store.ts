import Vuex, { Module } from 'vuex'
import { playerModule } from '@/player/store'
import { Playlist } from './api'

interface State {
  isLoggedIn: boolean;
  username: null | string;
  server: null | string;
  menuVisible: boolean;
  error: Error | null;
  playlists: null | Playlist[];
}

const setupRootModule = (): Module<State, any> => ({
  state: {
    isLoggedIn: false,
    username: null,
    server: null,
    menuVisible: false,
    error: null,
    playlists: null,
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    },
    setLoginSuccess(state, { username, server }) {
      state.isLoggedIn = true
      state.username = username
      state.server = server
    },
    setMenuVisible(state, visible) {
      state.menuVisible = visible
    },
  },
  actions: {
    showMenu({ commit }) {
      commit('setMenuVisible', true)
    },
    hideMenu({ commit }) {
      commit('setMenuVisible', false)
    },
  },
})

export function setupStore() {
  return new Vuex.Store({
    strict: true,
    ...setupRootModule(),
    modules: {
      player: {
        namespaced: true,
        ...playerModule
      },
    }
  })
}
