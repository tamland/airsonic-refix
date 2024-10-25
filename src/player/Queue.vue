<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0">
        Playing
      </h1>
      <div>
        <b-button variant="link" class="mr-2" :disabled="!tracks?.length" @click="shuffle">
          <Icon icon="shuffle" /> Shuffle
        </b-button>
        <b-button class="clear-btn" variant="link" :disabled="!tracks?.length" @click="clear">
          <Icon icon="x" /> Clear
          <div v-if="tracks?.length === 1 " class="tooltip bs-tooltip-bottom">
            <div class="tooltip-inner">
              Click again to clear current track
            </div>
          </div>
        </b-button>
      </div>
    </div>
    <ContentLoader v-slot :loading="loading">
      <BaseTable v-if="tracks.length > 0">
        <BaseTableHead>
          <th class="text-left d-none d-lg-table-cell">
            Artist
          </th>
          <th class="text-left d-none d-md-table-cell">
            Album
          </th>
          <th class="text-right d-none d-md-table-cell">
            Duration
          </th>
        </BaseTableHead>
        <tbody>
          <tr v-for="(item, index) in tracks" :key="index"
              :class="{'active': index === queueIndex}"
              :draggable="true" @dragstart="dragstart(item.id, $event)"
              @click="play(index)">
            <CellTrackNumber :active="index === queueIndex && isPlaying" :value="item.track" />
            <CellTitle :track="item" />
            <CellArtist :track="item" />
            <CellAlbum :track="item" />
            <CellDuration :track="item" />
            <CellActions :track="item">
              <b-dropdown-divider />
              <ContextMenuItem icon="x" variant="danger" :disabled="index === queueIndex" @click="remove(index)">
                Remove
              </ContextMenuItem>
            </CellActions>
          </tr>
        </tbody>
      </BaseTable>
      <EmptyIndicator v-else />
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellDuration from '@/library/track/CellDuration.vue'
  import CellAlbum from '@/library/track/CellAlbum.vue'
  import CellArtist from '@/library/track/CellArtist.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import CellActions from '@/library/track/CellActions.vue'

  export default defineComponent({
    components: {
      CellActions,
      CellTitle,
      CellArtist,
      CellAlbum,
      CellDuration,
      CellTrackNumber,
      BaseTableHead,
      BaseTable,
    },
    computed: {
      loading() {
        return this.$store.state.player.queue === null
      },
      isPlaying() {
        return this.$store.getters['player/isPlaying']
      },
      tracks() {
        return this.$store.state.player.queue
      },
      queueIndex() {
        return this.$store.state.player.queueIndex
      },
    },
    methods: {
      play(index: number) {
        if (index === this.queueIndex) {
          return this.$store.dispatch('player/playPause')
        }
        return this.$store.dispatch('player/playTrackListIndex', { index })
      },
      dragstart(id: string, event: any) {
        event.dataTransfer.setData('application/x-track-id', id)
      },
      remove(idx: number) {
        return this.$store.commit('player/removeFromQueue', idx)
      },
      clear() {
        return this.$store.dispatch('player/clearQueue')
      },
      shuffle() {
        return this.$store.commit('player/shuffleQueue')
      }
    }
  })
</script>
<style scoped>
  .clear-btn {
    position: relative;
  }

  .tooltip-inner {
    width: 300px;
  }

  .clear-btn:hover .tooltip {
    display: block;
    opacity: 1;
    right: 0;
  }
</style>
