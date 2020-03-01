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
    <Tiles :items="item.albums" v-slot="{ item }" square>
      <div class="text-truncate">
        <router-link :to="{name: 'album', params: { id: item.id } }">
          <strong>{{ item.name }}</strong>
        </router-link>
      </div>
      <div class="text-truncate text-muted">
        {{ item.artist }}
      </div>
    </Tiles>

    <h3 class="pt-5">Similar artist</h3>
    <Tiles :items="item.similarArtist" v-slot="{ item }">
      <ArtistCard :item="item"></ArtistCard>
    </Tiles>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import AlbumCard from "@/library/album/AlbumCard.vue";
import ArtistCard from "@/library/artist/ArtistCard.vue";

export default Vue.extend({
  components: {
    AlbumCard,
    ArtistCard,
  },
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
