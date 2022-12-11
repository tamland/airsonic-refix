<template>
  <ContentLoader v-slot :loading="items === null">
    <h1>Radio</h1>
    <BaseTable v-if="items.length > 0">
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
    <EmptyIndicator v-else-if="unsupported" label="Not supported" />
    <EmptyIndicator v-else />
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { RadioStation, UnsupportedOperationError } from '@/shared/api'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import ContentLoader from '@/shared/components/ContentLoader.vue'

  export default defineComponent({
    components: {
      ContentLoader,
      BaseTableHead,
      BaseTable,
      CellTitle,
      CellActions,
      CellTrackNumber,
    },
    data() {
      return {
        items: null as null | RadioStation[],
        unsupported: false,
      }
    },
    computed: {
      isPlaying(): boolean {
        return this.$store.getters['player/isPlaying']
      },
      playingTrackId(): null | string {
        return this.$store.getters['player/trackId']
      },
    },
    async created() {
      try {
        this.items = await this.$api.getRadioStations()
      } catch (err) {
        if (err instanceof UnsupportedOperationError) {
          this.items = []
          this.unsupported = true
          return
        }
        throw err
      }
    },
    methods: {
      play(index: number) {
        if (this.items && this.items[index].id === this.playingTrackId) {
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
