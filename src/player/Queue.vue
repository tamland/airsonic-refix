<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0">
        Playing
      </h1>
      <b-button variant="secondary" @click="clear()">
        Clear
      </b-button>
    </div>
    <BaseTable>
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
            <ContextMenuItem icon="x" variant="danger" @click="remove(index)">
              Remove
            </ContextMenuItem>
          </CellActions>
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import { mapState, mapGetters } from 'vuex'
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
      ...mapState('player', {
        tracks: 'queue',
        queueIndex: 'queueIndex',
      }),
      ...mapGetters('player', {
        isPlaying: 'isPlaying',
      }),
    },
    methods: {
      play(index: number) {
        if (index === this.queueIndex) {
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
      remove(idx: number) {
        return this.$store.commit('player/removeFromQueue', idx)
      },
      clear() {
        return this.$store.commit('player/clearQueue')
      },
    }
  })
</script>
