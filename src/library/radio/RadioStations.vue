<template>
  <ContentLoader v-slot :loading="items === null">
    <h1>Radio</h1>
    <TrackList v-if="items.length > 0" :tracks="items" no-artist no-album no-duration />
    <EmptyIndicator v-else-if="unsupported" label="Not supported" />
    <EmptyIndicator v-else />
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { RadioStation, UnsupportedOperationError } from '@/shared/api'
  import ContentLoader from '@/shared/components/ContentLoader.vue'
  import TrackList from '@/library/track/TrackList.vue'

  export default defineComponent({
    components: {
      TrackList,
      ContentLoader,
    },
    data() {
      return {
        items: null as null | RadioStation[],
        unsupported: false,
      }
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
  })
</script>
