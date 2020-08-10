<template>
  <div v-if="item">
    <h1>{{ item.name }}</h1>
    <TrackList :tracks="item.tracks" show-album />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import TrackList from '@/library/TrackList.vue'

  export default Vue.extend({
    components: {
      TrackList,
    },
    props: {
      id: { type: String, required: true }
    },
    data() {
      return {
        item: null as any,
      }
    },
    async created() {
      this.item = await this.$api.getGenreDetails(this.id)
    }
  })
</script>
