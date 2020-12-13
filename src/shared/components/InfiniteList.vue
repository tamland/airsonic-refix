<template>
  <div>
    <slot :items="items" />
    <InfiniteLoader :loading="loading" :has-more="hasMore" @load-more="loadMore" />
  </div>
</template>
  <script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      load: { type: Function, required: true },
    },
    data() {
      return {
        items: [] as any[],
        loading: false,
        offset: 0 as number,
        hasMore: true,
      }
    },
    methods: {
      loadMore() {
        this.loading = true
        this.load(this.offset).then((items: any[]) => {
          this.items.push(...items)
          this.offset += items.length
          this.hasMore = items.length > 0
          this.loading = false
        })
      }
    }
  })
</script>
