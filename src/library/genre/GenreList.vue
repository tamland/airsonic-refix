<template>
  <Tiles :items="items">
    <template v-slot="{ item }">
      <div class="text-truncate">
        <router-link :to="{name: 'genre', params: { id: item.id } }">
          <strong>{{ item.name }}</strong>
        </router-link>
      </div>
      <div class="text-truncate text-muted">
        <strong>{{ item.albumCount }}</strong> albums ·
        <strong>{{ item.songCount }}</strong> songs
      </div>
    </template>
  </Tiles>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  components: {
    
  },
  data() {
    return {
      items: []
    };
  },
  created() {
    this.$api.getGenres().then(items => {
      this.items = items;
    });
  }
});
</script>
