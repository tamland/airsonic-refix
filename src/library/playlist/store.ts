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
    async update({ id, name, comment, isPublic }: Playlist) {
      const playlist = this.playlists?.find(x => x.id === id)
      if (playlist) {
        playlist.name = name
        playlist.comment = comment
        playlist.isPublic = isPublic
        await this.api.editPlaylist(id, name, comment, isPublic)
      }
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
    async delete(id: string) {
      await this.api.deletePlaylist(id)
      this.playlists = this.playlists!.filter(p => p.id !== id)
    },
  },
})
