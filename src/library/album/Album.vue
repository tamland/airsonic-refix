<template>
  <div v-if="album">
    <div class="row mb-4">
      <div class="col-auto">
        <b-img height="300" width="300" :src="album.image"></b-img>
      </div>
      <div class="col">
        <h1>{{ album.name }}</h1>
        <p>by 
          <router-link :to="{name: 'artist', params: { id: album.artistId }}">
            {{ album.artist }}
          </router-link>
          <span v-if="album.year"> · {{ album.year }}</span>
          <span v-if="album.genre"> · {{ album.genre }}</span>
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <TrackList :tracks="album.song"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import TrackList from "@/library/TrackList.vue"

export default Vue.extend({
  components: {
    TrackList,
  },
  props: {
    id: String
  },
  data() {
    return {
      album: null,
    }
  },
  async mounted() {
    this.album = await this.$api.getAlbumDetails(this.id);
  }
});
</script>
