<template>
  <div>
    <Spinner :data="albums" v-slot="{albums: data}">
      <Tiles square>
        <Tile v-for="item in albums" :key="item.id"
          :image="item.image"
          :to="{name: 'album', params: { id: item.id } }"
          :title="item.name">
          <template v-slot:text>
            <router-link :to="{name: 'artist', params: { id: item.artistId } }">
              {{ item.artist }}
            </router-link>
          </template>
        </Tile>
      </Tiles>
    </Spinner>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { AlbumSort } from '@/shared/api';

export default Vue.extend({
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
      handler(value: AlbumSort) {
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
