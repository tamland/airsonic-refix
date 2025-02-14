<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0 me-2 text-truncate">
        Files
      </h1>
    </div>
    <ContentLoader v-slot :loading="item === null">
      <BaseTable>
        <BaseTableHead />
        <tbody class="text-break">
          <tr v-if="path" @click="openParent">
            <td>
              <Icon icon="folder" />
            </td>
            <td colspan="2">
              ..
            </td>
          </tr>
          <tr v-for="dir in item.directories" :key="dir.id" @click="openDirectory(dir.id)">
            <td>
              <Icon icon="folder" />
            </td>
            <td colspan="2">
              {{ dir.name }}
            </td>
          </tr>
          <tr
            v-for="track in item.tracks" :key="track.id"
            :class="{'active': track.id === playingTrackId}"
            @click="playTrack(track)"
          >
            <CellTrackNumber :active="track.id === playingTrackId && isPlaying" :value="track.track" />
            <CellTitle :track="track" />
            <CellActions :track="track" />
          </tr>
        </tbody>
      </BaseTable>
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { Directory, Track } from '@/shared/api'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import { orderBy } from 'lodash-es'
  import { usePlayerStore } from '@/player/store'

  export default defineComponent({
    components: {
      BaseTable,
      BaseTableHead,
      CellTrackNumber,
      CellTitle,
      CellActions
    },
    props: {
      path: { type: String, default: '' }
    },
    setup() {
      return {
        playerStore: usePlayerStore(),
      }
    },
    data() {
      return {
        item: null as null | Directory,
      }
    },
    computed: {
      isPlaying(): boolean {
        return this.playerStore.isPlaying
      },
      playingTrackId() {
        return this.playerStore.trackId
      },
    },
    watch: {
      path: {
        immediate: true,
        async handler(value: string) {
          this.item = null
          this.item = await this.$api.getDirectory(value)
          this.item.tracks = orderBy(this.item.tracks, ['track', 'title'])
          this.item.directories = orderBy(this.item.directories, 'name')
        }
      }
    },
    methods: {
      async playNow() {
        return this.playerStore.playNow(this.item!.tracks)
      },
      async shuffleNow() {
        return this.playerStore.shuffleNow(this.item!.tracks)
      },
      async playTrack(track: Track) {
        if (track.id === this.playingTrackId) {
          return this.playerStore.playPause()
        }
        const index = this.item!.tracks!.findIndex((x: any) => x.id === track.id)
        return this.playerStore.playTrackList(this.item!.tracks, index)
      },
      openDirectory(id: string) {
        const path = this.path === '' ? id : [this.path, id].join('/')
        this.$router.push({ path: `/files/${path}` })
      },
      openParent() {
        const path = this.path.split('/').slice(0, -1).join('/')
        this.$router.push({ path: `/files/${path}` })
      },
    }
  })
</script>
