import { defineStore } from 'pinia'
import { FileDirectory } from '@/shared/api'

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: null as null | FileDirectory,

    _library: null as null | FileDirectory,
    _pathID: '',
  }),
  actions: {
    async load(pathID: string) {
      console.log(pathID)
      this._pathID = pathID
      if (this._library === null) {
        this._library = await this.api.getFilesRoot()
      }

      let cd = this._library
      const path = pathID.split('/')
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
    // pathPush(id: string) {
    //   this.pathID = [...this.pathID.split('/'), id].join('/')
    //   localStorage.setItem('files_path', this.pathID)
    //   this.load()
    // },
    // pathPop() {
    //   this.pathID = this.pathID.split('/').slice(0, -1).join('/')
    //   localStorage.setItem('files_path', this.pathID)
    //   this.load()
    // },
    // pathSlice(idx: number) {
    //   this.pathID = this.pathID.split('/').slice(0, idx).join('/')
    //   localStorage.setItem('files_path', this.pathID)
    //   this.load()
    // }
  },
  getters: {
    pathString(store): string {
      if (!store._library) return ''

      const result = []
      const path = store._pathID.split('/')
      let cd = store._library
      for (let i = 0; i < path.length; i++) {
        result.push(cd.name)
        if (cd.dirs) {
          cd = cd.dirs.find(d => d.id === path[i + 1]) || cd
        } else {
          break
        }
      }
      return result.join('/') || ''
    }
  },
})
