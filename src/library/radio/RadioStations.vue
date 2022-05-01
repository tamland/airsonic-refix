<template>
  <div v-if="items">
    <h1>Radio</h1>
    <BaseTable>
      <BaseTableHead />
      <tbody>
        <tr v-for="(item, index) in items" :key="index"
            :class="{'active': item.id === playingTrackId}"
            @click="play(index)">
          <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
          <CellTitle :track="item" />
          <CellActions :track="item" />
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import { RadioStation } from '@/shared/api'
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
    },
    data() {
      return {
        items: [] as RadioStation[],
      }
    },
    computed: {
      isPlaying() {
        return this.$store.getters['player/isPlaying']
      },
      playingTrackId() {
        return this.$store.getters['player/trackId']
      },
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
