import Vue from 'vue'
import Vuex, { Module } from 'vuex'
import { ActionContext } from "vuex"
import { playerModule } from "@/player/store"
import axios from 'axios';
import { AuthService } from '@/auth/service';
import { API } from './api';

interface State {
  isLoggedIn: boolean;
  username: null | string;
  server: null | string;
  showMenu: boolean;
  error: Error | null;
  playlists: any[];
}

const setupRootModule = (authService: AuthService, api: API): Module<State, any> => ({
  state: {
    isLoggedIn: false,
    username: null,
    server: null,
    showMenu: false,
    error: null,
    playlists: [],
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
    setLoginSuccess(state, { username, server }) {
      state.isLoggedIn = true;
      state.username = username;
      state.server = server;
    },
    toggleMenu(state) {
      state.showMenu = !state.showMenu;
    },
    setPlaylists(state, playlists: any[]) {
      state.playlists = playlists;
    },
    removePlaylist(state, id: string) {
      state.playlists = state.playlists.filter(p => p.id !== id);
    },
  },
  actions: {
    loadPlaylists({ commit }) {
      api.getPlaylists().then(result => {
        commit("setPlaylists", result);
      })
    },
    createPlaylist({ commit }, name) {
      api.createPlaylist(name).then(result => {
        commit("setPlaylists", result);
      })
    },
    addTrackToPlaylist({ }, { playlistId, trackId }) {
      api.addToPlaylist(playlistId, trackId);
    },
    deletePlaylist({ commit, state }, id) {
      api.deletePlaylist(id).then(() => {
        commit("removePlaylist", id)
      })
    }
  },
});

export function setupStore(authService: AuthService, api: API) {
  const store = new Vuex.Store({
    strict: true,
    ...setupRootModule(authService, api),
    modules: {
      player: {
        namespaced: true,
        ...playerModule
      }
    }
  })

  store.watch(
    (state) => state.isLoggedIn,
    () => {
      store.dispatch("loadPlaylists")
    }
  );

  return store;
}
