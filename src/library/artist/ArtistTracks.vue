<template>
  <div>
    <TrackList v-if="items.length > 0" :tracks="items" />
    <InfiniteLoader :loading="loading" :has-more="hasMore" @load-more="loadMore" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import TrackList from '@/library/track/TrackList.vue'

  export default defineComponent({
    components: {
      TrackList,
    },
    props: {
      id: { type: String, required: true },
    },
    data() {
      return {
        loading: false,
        hasMore: true,
        items: [] as any[]
      }
    },
    computed: {
      generator() {
        return this.$api.getTracksByArtist(this.id)
      }
    },
    methods: {
      async loadMore() {
        this.loading = true
        const { value, done } = await this.generator.next()
        if (value !== undefined) {
          this.items.push(...value)
        }
        this.hasMore = !done
        this.loading = false
      }
    }
  })
</script>
