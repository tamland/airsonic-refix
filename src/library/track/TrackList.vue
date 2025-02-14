<template>
  <BaseTable>
    <BaseTableHead>
      <th v-if="!noArtist" class="text-start d-none d-lg-table-cell">
        Artist
      </th>
      <th v-if="!noAlbum" class="text-start d-none d-md-table-cell">
        Album
      </th>
      <th v-if="!noDuration" class="text-end d-none d-md-table-cell">
        Duration
      </th>
    </BaseTableHead>
    <tbody>
      <tr v-for="(item, index) in tracks" :key="index"
          :class="{'active': item.id === playingTrackId}"
          :draggable="true" @dragstart="dragstart(item, $event)"
          @click="play(index)">
        <CellTrackNumber
          :active="item.id === playingTrackId && isPlaying"
          :value="item.track || index + 1"
        />
        <CellTitle :track="item" />
        <CellArtist v-if="!noArtist" :track="item" />
        <CellAlbum v-if="!noAlbum" :track="item" />
        <CellDuration v-if="!noDuration" :track="item" />
        <CellActions :track="item">
          <slot name="context-menu" :index="index" :item="item" />
        </CellActions>
      </tr>
    </tbody>
  </BaseTable>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import CellDuration from '@/library/track/CellDuration.vue'
  import CellArtist from '@/library/track/CellArtist.vue'
  import CellAlbum from '@/library/track/CellAlbum.vue'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import { Track } from '@/shared/api'
  import { usePlayerStore } from '@/player/store'

  export default defineComponent({
    components: {
      BaseTableHead,
      BaseTable,
      CellTitle,
      CellActions,
      CellTrackNumber,
      CellAlbum,
      CellArtist,
      CellDuration,
    },
    props: {
      tracks: { type: Array as PropType<Track[]>, required: true },
      noAlbum: { type: Boolean, default: false },
      noArtist: { type: Boolean, default: false },
      noDuration: { type: Boolean, default: false },
    },
    setup() {
      return {
        playerStore: usePlayerStore(),
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
    methods: {
      play(index: number) {
        if (this.tracks[index].id === this.playingTrackId) {
          return this.playerStore.playPause()
        }
        return this.playerStore.playTrackList(this.tracks, index)
      },
      dragstart(item: any, event: any) {
        if (!item.isStream) {
          event.dataTransfer.setData('application/x-track-id', item.id)
        }
      },
    }
  })
</script>
