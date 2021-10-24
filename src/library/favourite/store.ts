import { Module } from 'vuex'
import { API } from '@/shared/api'
import Vue from 'vue'

interface State {
  albums: any
  artists: any
  tracks: any
}

export const setupModule = (api: API): Module<State, any> => ({
  state: {
    albums: {} as any,
    artists: {} as any,
    tracks: {} as any,
  },
  mutations: {
    set(state, items: State) {
      Object.assign(state, items)
    },
    add(state, { type, id }) {
      Vue.set(state[getTypeKey(type)], id, true)
    },
    remove(state, { type, id }) {
      Vue.delete(state[getTypeKey(type)], id)
    },
  },
  actions: {
    load({ commit }) {
      api.getFavourites().then(result => {
        commit('set', {
          albums: createIdMap(result.albums),
          artists: createIdMap(result.artists),
          tracks: createIdMap(result.tracks),
        })
      })
    },
    toggle({ state, commit }, { type, id }) {
      if (state[getTypeKey(type)][id]) {
        commit('remove', { id, type })
        return api.removeFavourite(id, type)
      } else {
        commit('add', { id, type })
        return api.addFavourite(id, type)
      }
    },
  },
})

function createIdMap(items: [{ id: string }]) {
  return Object.assign({}, ...items.map((item) => ({ [item.id]: true })))
}

function getTypeKey(type: string): keyof State {
  switch (type) {
    case 'album': return 'albums'
    case 'artist': return 'artists'
    case 'track': return 'tracks'
    default: throw new Error(`unknown favourite type '${type}'`)
  }
}
