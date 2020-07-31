<template>
  <div v-if="item">
    <div class="row mb-2">
      <!-- <div class="col"> -->
        <!-- <b-img height="300" width="300" :src="item.image"></b-img> -->
      <!-- </div> -->
      <div class="col col-xl-8">
        <h1>{{ item.name }}</h1>
        <p>{{ item.description }}</p>
      </div>
    </div>
    <h3 class="pt-5">Albums</h3>
    <Tiles square>
      <Tile v-for="item in item.albums" :key="item.id"
        :image="item.image"
        :to="{name: 'album', params: { id: item.id } }"
        :title="item.name"
        :text="item.artist">
      </Tile>
    </Tiles>
    <h3 class="pt-5">Similar artist</h3>
    <Tiles>
      <Tile v-for="item in item.similarArtist" :key="item.id"
        :to="{name: 'artist', params: { id: item.id } }"
        :title="item.name">
        <template v-slot:text>
          <strong>{{ item.albumCount }}</strong> albums
        </template>
      </Tile>
    </Tiles>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  components: {},
  props: {
    id: String
  },
  data() {
    return {
      item: null as any,
    }
  },
  watch: {
    id: {
      immediate: true,
      async handler(value: string) {
        this.item = null,
        this.item = await this.$api.getArtistDetails(this.id);
      }
    }
  }
});
</script>
