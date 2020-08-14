<template>
  <ArtistList :items="items" />
</template>
<script lang="ts">
  import Vue from 'vue'
  import ArtistList from './ArtistList.vue'
  import { Artist } from '@/shared/api'

  export default Vue.extend({
    components: {
      ArtistList,
    },
    data() {
      return {
        items: [] as Artist[]
      }
    },
    created() {
      this.$api.getArtists().then(items => {
        this.items = items
      })
    }
  })
</script>
