import { defineStore } from 'pinia'
import { Podcast } from '@/shared/api'
import { orderBy } from 'lodash-es'

export const usePodcastStore = defineStore('podcast', {
  state: () => ({
    podcasts: null as null | Podcast[],

    _downloadingQueue: [] as string[],
    _timer: null as null | number,
  }),
  actions: {
    async load(force = false) {
      if (this.podcasts !== null && !force) return

      const podcasts = await this.api.getPodcasts()
      this.podcasts = orderBy(podcasts, 'createdAt')
      if (podcasts) {
        podcasts.forEach(p => {
          p?.tracks.forEach(t => {
            if (t.episodeStatus === 'downloading') {
              if (this._downloadingQueue.includes(p.id)) return
              this._downloadingQueue.push(p.id)
            }
          })
        })
        if (this._downloadingQueue.length > 0) await this.downloadingQueueHandler()
      }
    },
    async loadPodcast(id: string) {
      if (!this.podcasts) return

      const i = this.podcasts.findIndex(p => p.id === id)
      if (i < 0) return

      const podcast = await this.api.getPodcast(id)
      if (!podcast) return

      this.podcasts = [...this.podcasts.slice(0, i), podcast, ...this.podcasts.slice(i, this.podcasts.length - 1)]
    },
    async refresh() {
      try {
        await this.api.refreshPodcasts()
        await this.load(true)
      } catch (e) {

      }
    },
    async add(url: string) {
      try {
        await this.api.addPodcast(url)
        await this.load(true)
      } catch (e) {

      }
    },
    async delete(id: string) {
      try {
        await this.api.deletePodcast(id)
        this.podcasts = this.podcasts?.filter(p => p.id !== id) || []
      } catch (e) {

      }
    },
    async downloadEpisode(podcastId: string, episodeId: string) {
      try {
        await this.api.downloadPodcastEpisode(episodeId)
        if (!this._downloadingQueue.includes(podcastId)) this._downloadingQueue.push(podcastId)
        await this.downloadingQueueHandler()
        setTimeout(async() => {
          await this.loadPodcast(podcastId)
        }, 1000)
      } catch (e) {

      }
    },
    async deleteEpisode(podcastId: string, episodeId: string) {
      try {
        await this.api.deletePodcastEpisode(episodeId)
        setTimeout(async() => {
          await this.loadPodcast(podcastId)
        }, 1000)
      } catch (e) {

      }
    },
    async redownloadEpisode(podcastId: string, episodeId: string) {
      try {
        await this.api.deletePodcastEpisode(episodeId)
        this.downloadEpisode(podcastId, episodeId)
      } catch (e) {

      }
    },

    getPodcast(id: string) {
      return this.podcasts ? this.podcasts?.find(p => p.id === id) || null : null
    },
    async downloadingQueueHandler() {
      if (this._timer !== null) return
      this._timer = setInterval(async() => {
        if (!this.podcasts || this._downloadingQueue.length === 0) {
          if (this._timer) {
            clearInterval(this._timer)
            this._timer = null
          }
          return
        }

        for (let i = 0; i < this._downloadingQueue.length; i++) {
          await this.loadPodcast(this._downloadingQueue[i])

          const p = this.podcasts.find(p => p.id === this._downloadingQueue[i])
          if (!p) continue

          const dtracks = p.tracks ? p.tracks.filter((p: any) => p.episodeStatus === 'downloading') : null
          if (dtracks && dtracks.length === 0) {
            this._downloadingQueue = this._downloadingQueue.filter(item => item !== p.id)
          }
        }
      }, 30000)
    },
  },
})
