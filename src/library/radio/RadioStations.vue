<template>
  <div v-if="items">
    <h1>Radio</h1>
    <BaseTable>
      <BaseTableHead />
      <tbody>
        <tr v-for="(item, index) in items" :key="index"
            :class="{'active': item.id === playingTrackId}"
            @click="play(index)">
          <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :track="item" />
          <CellTitle :track="item" />
          <CellActions :track="item" />
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { RadioStation } from '@/shared/api'
  import { mapGetters } from 'vuex'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'

  export default Vue.extend({
    components: {
      BaseTableHead,
      BaseTable,
      CellTitle,
      CellActions,
      CellTrackNumber,
    },
    data() {
      return {
        items: [] as RadioStation[],
      }
    },
    computed: {
      ...mapGetters({
        playingTrackId: 'player/trackId',
        isPlaying: 'player/isPlaying',
      }),
    },
    async created() {
      this.items = await this.$api.getRadioStations()
    },
    methods: {
      play(index: number) {
        if (this.items[index].id === this.playingTrackId) {
          return this.$store.dispatch('player/playPause')
        }
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks: this.items
        })
      },
    }
  })
</script>
