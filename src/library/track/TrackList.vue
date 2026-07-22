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
      <template v-for="(item, index) in tracks">
        <tr v-if="isMultiDisc && isFirstTrackOfDisc(index)" :key="`disc-${discNumber(item)}`" class="disc-heading">
          <td />
          <td :colspan="columnCount - 1">
            <div class="d-flex align-items-center gap-3">
              <img
                v-if="discImageFor(item)"
                :src="discImageFor(item)"
                :alt="`${discLabel(item)} cover art`"
                class="rounded object-fit-cover"
                width="72"
                height="72"
              >
              <div>
                <div v-if="discTitleFor(item)?.title" class="text-muted">
                  Disc {{ discNumber(item) }}
                </div>
                <h2 class="h5 mb-0">
                  {{ discLabel(item) }}
                </h2>
              </div>
            </div>
          </td>
        </tr>
        <tr :key="item.id"
            :class="{'active': item.id === playingTrackId}"
            :draggable="true" @dragstart="dragstart(item, $event)"
            @click="play(index)">
          <CellTrackNumber
            :active="item.id === playingTrackId && isPlaying"
            :value="trackNumber(item, index)"
          />
          <CellTitle :track="item" />
          <CellArtist v-if="!noArtist" :track="item" />
          <CellAlbum v-if="!noAlbum" :track="item" />
          <CellDuration v-if="!noDuration" :track="item" />
          <CellActions :track="item">
            <slot name="context-menu" :index="index" :item="item" />
          </CellActions>
        </tr>
      </template>
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
  import { DiscTitle, Track } from '@/shared/api'
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
      discTitles: { type: Array as PropType<DiscTitle[]>, default: () => [] },
      discImage: { type: String, default: undefined },
      groupByDisc: { type: Boolean, default: false },
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
      isMultiDisc(): boolean {
        return this.groupByDisc && new Set(this.tracks.map(track => track.discNumber ?? 1)).size > 1
      },
      columnCount(): number {
        return 3 + Number(!this.noArtist) + Number(!this.noAlbum) + Number(!this.noDuration)
      },
    },
    methods: {
      discNumber(track: Track): number {
        return track.discNumber ?? 1
      },
      discTitleFor(track: Track): DiscTitle | undefined {
        const discNumber = this.discNumber(track)
        return this.discTitles.find(({ disc }) => disc === discNumber)
      },
      discLabel(track: Track): string {
        return this.discTitleFor(track)?.title || `Disc ${this.discNumber(track)}`
      },
      discImageFor(track: Track): string | undefined {
        return this.discTitleFor(track)?.image || this.discImage
      },
      isFirstTrackOfDisc(index: number): boolean {
        return index === 0 || this.discNumber(this.tracks[index - 1]) !== this.discNumber(this.tracks[index])
      },
      trackNumber(track: Track, index: number): number {
        if (track.track) {
          return track.track
        }
        const discNumber = this.discNumber(track)
        while (index > 0 && this.discNumber(this.tracks[index - 1]) === discNumber) {
          index--
        }
        return this.tracks.indexOf(track) - index + 1
      },
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
<style scoped>
  .disc-heading {
    --bs-table-hover-bg: transparent;
    cursor: default !important;
  }
</style>
