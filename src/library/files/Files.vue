<template>
  <ContentLoader v-slot :loading="files === null">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0 mr-2 text-truncate">
        Files
      </h1>
      <!-- <b-button variant="link" :disabled="unsupported" @click="editRadioStation()">
        <Icon icon="plus" />
      </b-button> -->
    </div>
    <div class="d-flex justify-content-between align-items-center mb-2">
    {{ path }}
    </div>
    <BaseTable>
      <BaseTableHead>
        <th class="text-right d-none d-md-table-cell">
          Duration
        </th>
      </BaseTableHead>
      <tbody>
        <template v-if="files.id">
          <tr @click="filesStore.pathShift()">
            <td><Icon icon="folder" /></td>
            <td colspan="3">..</td>
            <!-- <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
            <CellTitle :track="item">
              {{ item.title }} <Icon v-if="item.playCount > 0" icon="check" />
            </CellTitle>
            <CellDuration :track="item" />
            <CellActions :track="item" /> -->
          </tr>
        </template>
        <template v-if="files.dirs">
          <tr v-for="item in files.dirs" :key="item.id" @click="filesStore.pathPush(item.id)">
            <td><Icon icon="folder" /></td>
            <td colspan="3">{{ item.name }}</td>
            <!-- <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
            <CellTitle :track="item">
              {{ item.title }} <Icon v-if="item.playCount > 0" icon="check" />
            </CellTitle>
            <CellDuration :track="item" />
            <CellActions :track="item" /> -->
          </tr>
        </template>
        <template v-if="files.files">
          <tr v-for="item in files.files" :key="item.id" @click="playTrack(item)">
            <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
            <td colspan="2">{{ item.name }}</td>
            <!-- <CellTitle :track="item">
              {{ item.title }} <Icon v-if="item.playCount > 0" icon="check" />
            </CellTitle>
            <CellDuration :track="item" /> -->
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
  import { UnsupportedOperationError } from '@/shared/api'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import CellDuration from '@/library/track/CellDuration.vue'
  import CellTitle from '@/library/track/CellTitle.vue'

  export default defineComponent({
    components: {
      BaseTable,
      BaseTableHead,
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
          // return
        }
        // this.setError(err)
      })
    },
    computed: {
      isPlaying(): boolean {
        return this.$store.getters['player/isPlaying']
      },
      playingTrackId(): any {
        return this.$store.getters['player/trackId']
      },
    },
    methods: {
      // removeTrack(index: number) {
      //   this.playlist.tracks.splice(index, 1)
      //   return this.playlistStore.removeTrack(this.id, index)
      // },
      // updatePlaylist(value: any) {
      //   this.playlist = value
      //   return this.playlistStore.update(this.playlist)
      // },
      // deletePlaylist() {
      //   return this.playlistStore.delete(this.id).then(() => {
      //     this.$router.replace({ name: 'playlists' })
      //   })
      // },
    }

  })
</script>
