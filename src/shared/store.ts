import Vuex, { Module } from 'vuex'
import { playerModule } from '@/player/store'
import { AuthService } from '@/auth/service'
import { API, Playlist } from './api'

interface State {
  isLoggedIn: boolean;
  username: null | string;
  server: null | string;
  menuVisible: boolean;
  error: Error | null;
  playlists: null | Playlist[];
}

const setupRootModule = (authService: AuthService, api: API): Module<State, any> => ({
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
    setPlaylists(state, playlists: Playlist[]) {
      state.playlists = playlists
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    updatePlaylist(state, playlist: any) {
      if (state.playlists) {
        const idx = state.playlists?.findIndex(x => x.id === playlist.id)
        state.playlists.splice(idx, 1, { ...state.playlists[idx], ...playlist })
      }
    },
    removePlaylist(state, id: string) {
      if (state.playlists) {
        state.playlists = state.playlists.filter(p => p.id !== id)
      }
    },
  },
  actions: {
    showMenu({ commit }) {
      commit('setMenuVisible', true)
    },
    hideMenu({ commit }) {
      commit('setMenuVisible', false)
    },
    loadPlaylists({ commit }) {
      return api.getPlaylists().then(result => {
        commit('setPlaylists', result)
      })
    },
    createPlaylist({ commit }, name) {
      return api.createPlaylist(name).then(result => {
        commit('setPlaylists', result)
      })
    },
    updatePlaylist({ commit }, { id, name, comment }) {
      return api.editPlaylist(id, name, comment).then(() => {
        commit('updatePlaylist', { id, name, comment })
      })
    },
    addTracksToPlaylist({ state, commit }, { playlistId, trackIds }) {
      const playlist = state.playlists?.find(x => x.id === playlistId)
      return api.addToPlaylist(playlistId, trackIds).then(() => {
        commit('updatePlaylist', {
          id: playlistId,
          updatedAt: new Date().toISOString(),
          trackCount: (playlist?.trackCount || 0) + 1,
        })
      })
    },
    deletePlaylist({ commit }, id) {
      return api.deletePlaylist(id).then(() => {
        commit('removePlaylist', id)
      })
    },
  },
})

export function setupStore(authService: AuthService, api: API) {
  const store = new Vuex.Store({
    strict: true,
    ...setupRootModule(authService, api),
    modules: {
      player: {
        namespaced: true,
        ...playerModule
      },
    }
  })

  store.watch(
    (state) => state.isLoggedIn,
    () => {
      store.dispatch('loadPlaylists')
    }
  )

  return store
}
