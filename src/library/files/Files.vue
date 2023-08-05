<template>
  <ContentLoader v-slot :loading="files === null">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0 mr-2 text-truncate">
        Files
      </h1>
      <div v-if="files.files">
        <b-button variant="secondary" class="mr-2" @click="playNow">
          <Icon icon="play" /> Play
        </b-button>
        <b-button variant="secondary" class="mr-2" @click="shuffleNow">
          <Icon icon="shuffle" /> Shuffle
        </b-button>
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-2">
    {{ path }}
    </div>
    <BaseTable>
      <BaseTableHead />
      <tbody class="text-break">
        <template v-if="files.id">
          <tr @click="filesStore.pathPop()">
            <td><Icon icon="folder" /></td>
            <td colspan="2">..</td>
          </tr>
        </template>
        <template v-if="files.dirs">
          <tr v-for="item in files.dirs" :key="item.id" @click="filesStore.pathPush(item.id)">
            <td><Icon icon="folder" /></td>
            <td colspan="2">{{ item.name }}</td>
          </tr>
        </template>
        <template v-if="files.files">
          <tr v-for="item in files.files" :key="item.id" :class="{'active': item.id === playingTrackId}" @click="playTrack(item)">
            <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
            <CellTitle :track="item" />
            <CellActions :track="item" />
          </tr>
        </template>
      </tbody>
    </BaseTable>
  </ContentLoader>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useFilesStore } from '@/library/files/store'
  import { Track, UnsupportedOperationError } from '@/shared/api'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import CellActions from '@/library/track/CellActions.vue'

  export default defineComponent({
    components: {
      BaseTable,
      BaseTableHead,
      CellTrackNumber,
      CellTitle,
      CellActions
    },
    setup() {
      const filesStore = useFilesStore()
      const { files, pathString: path } = storeToRefs(filesStore)
      return { filesStore, files, path }
    },
    data() {
      return {
        unsupported: false,
      }
    },
    async created() {
      this.filesStore.load().catch(err => {
        if (err instanceof UnsupportedOperationError) {
          this.unsupported = true
        }
      })
    },
    computed: {
      isPlaying(): boolean {
        return this.$store.getters['player/isPlaying']
      },
      playingTrackId(): any {
        return this.$store.getters['player/trackId']
      },
      playableTracks(): Track[] {
        return (this.files?.files || [])
      }
    },
    methods: {
      async playNow() {
        return this.$store.dispatch('player/playNow', {
          tracks: this.playableTracks,
        })
      },
      async shuffleNow() {
        return this.$store.dispatch('player/shuffleNow', {
          tracks: this.playableTracks,
        })
      },
      async playTrack(track: Track) {
        if (track.id === this.playingTrackId) {
          return this.$store.dispatch('player/playPause')
        }
        const index = this.playableTracks.findIndex((x: any) => x.id === track.id)
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks: this.playableTracks,
        })
      },
    }

  })
</script>
