<template>
  <ContentLoader v-slot :loading="items === null">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0 mr-2 text-truncate">
        Radio
      </h1>
    </div>

    <TrackList v-if="items.length > 0" :tracks="items" no-artist no-album no-duration>
    </TrackList>
    <EmptyIndicator v-else-if="unsupported" label="Not supported" />
    <EmptyIndicator v-else />

  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { RadioStation, UnsupportedOperationError } from '@/shared/api'
  import ContentLoader from '@/shared/components/ContentLoader.vue'
  import EditModal from '@/shared/components/EditModal.vue'
  import TrackList from '@/library/track/TrackList.vue'

  export default defineComponent({
    components: {
      TrackList,
      ContentLoader,
      EditModal,
    },
    data() {
      return {
        items: null as null | RadioStation[],
        unsupported: false,
        modalVisible: false,
        editItem: {},
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
