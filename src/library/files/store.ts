import { defineStore, storeToRefs } from 'pinia'
import { FileDirectory } from '@/shared/api'
import { orderBy } from 'lodash-es'

export const useFilesStore = defineStore('files', {
  state: () => ({
    pathID: '',
    files: null as null | FileDirectory,

    _library: null as null | FileDirectory,
  }),
  actions: {
    async load() {
      if (this._library === null) {
        this._library = await this.api.getFilesRoot()
      }

      let cd = this._library
      const path = this.pathID.split('/')
      try {
        for (let i = 0; i < path.length; i++) {
          if (!cd.dirs && !cd.files) await this.api.getFiles(cd)
          if (!cd.dirs && !cd.files) throw new TypeError('')
          if (cd.dirs) {
            cd = cd.dirs.find(d => d.id === path[i + 1]) || cd
          } else {
            break
          }
        }
      } catch (e) {}
      this.files = cd
    },
    pathPush(id: string) {
      this.pathID = [...this.pathID.split('/'), id].join('/')
      this.load()
    },
    pathShift() {
      this.pathID = this.pathID.split('/').slice(0, -1).join('/')
      this.load()
    }
    // async pathChange(path: string) {

    // }
  },
  getters: {
    pathString(store): string {
      if (!store._library) return '/'

      const result = []
      const path = store.pathID.split('/')
      let cd = store._library
      for (let i = 0; i < path.length; i++) {
        result.push(cd.name)
        if (cd.dirs) {
          cd = cd.dirs.find(d => d.id === path[i + 1]) || cd
        } else {
          break
        }
      }
      return result.join(' / ') || '/'
    }
  },
})
