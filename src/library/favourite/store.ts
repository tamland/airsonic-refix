import Vue from 'vue'
import { defineStore } from 'pinia'

type MediaType = 'track' | 'album' | 'artist'

export const useFavouriteStore = defineStore('favourite', {
  state: () => ({
    albums: {} as any,
    artists: {} as any,
    tracks: {} as any,
  }),
  actions: {
    load() {
      return this.api.getFavourites().then(result => {
        this.albums = createIdMap(result.albums)
        this.artists = createIdMap(result.artists)
        this.tracks = createIdMap(result.tracks)
      })
    },
    toggle(type: MediaType, id: string) {
      const field = getTypeKey(type)
      if (this[field][id]) {
        Vue.delete(this[field], id)
        return this.api.removeFavourite(id, type)
      } else {
        Vue.set(this[field], id, true)
        return this.api.addFavourite(id, type)
      }
    },
  },
})

function createIdMap(items: [{ id: string }]) {
  return Object.assign({}, ...items.map((item) => ({ [item.id]: true })))
}

function getTypeKey(type: string): 'albums' | 'artists' |'tracks' {
  switch (type) {
    case 'album': return 'albums'
    case 'artist': return 'artists'
    case 'track': return 'tracks'
    default: throw new Error(`unknown favourite type '${type}'`)
  }
}
