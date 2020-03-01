<template>
  <div>
    <Spinner :data="albums" v-slot="{albums: data}">
      <Tiles :items="albums" v-slot="{ item }" square>
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
    </Spinner>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import AlbumCard from "./AlbumCard.vue";

export default Vue.extend({
  components: {
    AlbumCard
  },
  props: {
    msg: String
  },
  data() {
    return {
      sort: "newest",
      albums: null,
    };
  },
  computed: {
    sortOptions() {
      return [
        { text: "A-Z", value: "alphabeticalByName" },
        { text: "Date", value: "newest" },
        { text: "frequent", value: "frequent" },
        // { text: "random", value: "random" },
        // { text: "recent", value: "recent" },
        // { text: "starred", value: "starred" },
      ]
    }
  },
  watch: {
    sort: {
      immediate: true,
      handler(value: string) {
        this.albums = null;
        this.$api.getAlbums(value).then(albums => {
          this.albums = albums;
        });
      }
    }
  },
  created() {
  }
});
</script>
