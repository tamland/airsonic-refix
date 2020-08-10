<template>
  <ArtistList :items="items" />
</template>
<script lang="ts">
  import Vue from 'vue'
  import ArtistList from './ArtistList.vue'

  export default Vue.extend({
    components: {
      ArtistList,
    },
    data() {
      return {
        items: []
      }
    },
    created() {
      this.$api.getArtists().then(items => {
        this.items = items
      })
    }
  })
</script>
