<template>
  <Tiles :items="items" v-slot="{ item }">
    <div class="text-truncate">
      <router-link :to="{name: 'artist', params: { id: item.id } }">
        <strong>{{ item.name }}</strong>
      </router-link>
    </div>
     <div class="text-truncate text-muted">
      <strong>{{ item.albumCount }}</strong> albums
    </div>
  </Tiles>
</template>
<script lang="ts">
  import Vue from "vue";
  import ArtistCard from "./ArtistCard.vue";

  export default Vue.extend({
    components: {
      ArtistCard,
    },
    data() {
      return {
        items: []
      };
    },
    created() {
      this.$api.getArtists().then(items => {
        this.items = items;
      });
    }
  });
</script>
