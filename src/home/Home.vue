<template>
  <div>
    <Spinner v-if="loading"/>
    <template v-else>
      <div v-for="section in sections" :key="section.key" class="mb-4">
        <h1>{{ section.name }}</h1>
        <Tiles :items="$data[section.key]" v-slot="{ item }" square>
          <div class="text-truncate">
            <router-link :to="{name: 'album', params: { id: item.id } }">
              <strong>{{ item.name }}</strong>
            </router-link>
          </div>
          <div class="text-truncate text-muted">
            <router-link :to="{name: 'artist', params: { id: item.artistId } }">
              {{ item.artist }}
            </router-link>
          </div>
        </Tiles>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      sections: [
        { name: "Recently played", key: "recent" },
        { name: "Recently added", key: "newest" },
        { name: "Most played", key: "frequent" },
        { name: "Random", key: "random" },
      ],
      loading: true as boolean,
      recent: [],
      newest: [],
      frequent: [],
      random: [],
    }
  },
  created() {
    const size = 10;
    this.$api.getAlbums("recent", size).then(result => {
      this.recent = result;
      this.loading = false;
    });
    this.$api.getAlbums("newest", size).then(result => {
      this.newest = result
    });
    this.$api.getAlbums("frequent", size).then(result => {
      this.frequent = result
    });
    this.$api.getAlbums("random", 50).then(result => {
      this.random = result
    });
  }
});
</script>
