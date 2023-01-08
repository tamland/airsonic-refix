import { defineStore } from 'pinia'
import { Playlist } from '@/shared/api'
import { orderBy } from 'lodash-es'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlists: null as null | Playlist[],
  }),
  actions: {
    load() {
      return this.api.getPlaylists().then(result => {
        this.playlists = orderBy(result, 'createdAt')
      })
    },
    create(name: string) {
      return this.api.createPlaylist(name).then(result => {
        this.playlists = orderBy(result, 'createdAt')
      })
    },
    update(playlist: {id: string, name: string, comment: string}) {
      this._replacePlaylist(playlist)
      return this.api.editPlaylist(playlist.id, playlist.name, playlist.comment)
    },
    async addTracks(playlistId: string, trackIds: string[]) {
      const playlist = this.playlists?.find(x => x.id === playlistId)
      if (playlist) {
        await this.api.addToPlaylist(playlistId, trackIds)
        playlist.updatedAt = new Date().toISOString()
        playlist.trackCount = (playlist?.trackCount || 0) + trackIds.length
      }
    },
    async removeTrack(playlistId: string, index: number) {
      const playlist = this.playlists?.find(x => x.id === playlistId)
      if (playlist) {
        await this.api.removeFromPlaylist(playlistId, index)
        playlist.updatedAt = new Date().toISOString()
        playlist.trackCount = (playlist?.trackCount || 0) - 1
      }
    },
    deletePlaylist(id: string) {
      return this.api.deletePlaylist(id).then(() => {
        this.playlists = this.playlists!.filter(p => p.id !== id)
      })
    },
    _replacePlaylist(playlist: any) {
      if (this.playlists) {
        const idx = this.playlists?.findIndex(x => x.id === playlist.id)
        this.playlists.splice(idx, 1, { ...this.playlists[idx], ...playlist })
      }
    },
  },
})
