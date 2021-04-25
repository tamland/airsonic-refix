<template>
  <ContentLoader v-slot :loading="items == null">
    <ArtistList :items="items" />
  </ContentLoader>
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
        items: null as null | Artist[]
      }
    },
    async created() {
      this.items = await this.$api.getArtists()
    }
  })
</script>
