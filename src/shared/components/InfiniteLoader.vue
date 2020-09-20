<template>
  <infinite-loading ref="inf" force-use-infinite-wrapper @infinite="loadMore">
    <template slot="spinner">
      <div class="d-flex justify-content-center my-4">
        <span class="spinner-border" />
      </div>
    </template>
    <template slot="no-more">
      <span />
    </template>
    <template slot="no-results">
      <span />
    </template>
  </infinite-loading>
</template>
<script lang="ts">
  import Vue from 'vue'
  import InfiniteLoading from 'vue-infinite-loading'

  export default Vue.extend({
    components: {
      InfiniteLoading,
    },
    props: {
      loading: { type: Boolean, required: true },
      hasMore: { type: Boolean, required: true },
    },
    watch: {
      loading: {
        handler(value: boolean) {
          if (!this.hasMore) {
            (this.$refs.inf as any).stateChanger.complete()
          } else if (!value) {
            (this.$refs.inf as any).stateChanger.loaded()
          }
        }
      },
      hasMore: {
        handler(value: boolean) {
          if (!value) {
            (this.$refs.inf as any).stateChanger.complete()
          }
        }
      }
    },
    methods: {
      loadMore() {
        this.$emit('loadMore')
      },
    }
  })
</script>
