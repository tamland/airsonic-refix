import { defineStore } from 'pinia'
import { RadioStation } from '@/shared/api'

export const useRadioStore = defineStore('radio', {
  state: () => ({
    items: null as null | RadioStation[],
  }),
  actions: {
    load() {
      return this.api.getRadioStations().then(result => {
        this.items = result
      })
    },
    async create(name: string, url: string, homepageUrl: string) {
      return this.api.addRadioStation(name, url, homepageUrl).then(result => {
        this.load()
      })
    },
    async update(item: RadioStation) {
      return this.api.updateRadioStation(item).then(result => {
        this.items = this.items!.map(rs => (rs.id !== item.id) ? rs : item)
      })
    },
    async delete(id: string) {
      return this.api.deleteRadioStation(id).then(result => {
        this.items = this.items!.filter(rs => rs.id !== id)
      })
    },
  },
})
