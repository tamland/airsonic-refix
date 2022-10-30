<template>
  <BaseTable>
    <BaseTableHead>
      <th v-if="!noArtist" class="text-left d-none d-lg-table-cell">
        Artist
      </th>
      <th v-if="!noAlbum" class="text-left d-none d-md-table-cell">
        Album
      </th>
      <th v-if="!noDuration" class="text-right d-none d-md-table-cell">
        Duration
      </th>
    </BaseTableHead>
    <tbody>
      <tr v-for="(item, index) in tracks" :key="index"
          :class="{'active': item.id === playingTrackId}"
          :draggable="true" @dragstart="dragstart(item.id, $event)"
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
  import { defineComponent } from 'vue'
  import CellDuration from '@/library/track/CellDuration.vue'
  import CellArtist from '@/library/track/CellArtist.vue'
  import CellAlbum from '@/library/track/CellAlbum.vue'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'

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
      tracks: { type: Array, required: true },
      noAlbum: { type: Boolean, default: false },
      noArtist: { type: Boolean, default: false },
      noDuration: { type: Boolean, default: false },
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
      play(index: number) {
        if ((this.tracks as any)[index].id === this.playingTrackId) {
          return this.$store.dispatch('player/playPause')
        }
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks: this.tracks,
        })
      },
      dragstart(id: string, event: any) {
        event.dataTransfer.setData('id', id)
      },
    }
  })
</script>
