<template>
  <div v-if="album">
    <div class="d-flex mb-3">
      <div class="mr-3 mr-md-4 image-container">
        <b-img height="300" width="300" fluid :src="album.image" />
      </div>
      <div>
        <h1>{{ album.name }}</h1>
        <p>
          by
          <router-link :to="{name: 'artist', params: { id: album.artistId }}">
            {{ album.artist }}
          </router-link>
          <span v-if="album.year"> · {{ album.year }}</span>
          <span v-if="album.genre"> · {{ album.genre }}</span>
        </p>
        <div class="text-nowrap">
          <b-btn variant="secondary" class="mr-2" @click="play">
            <Icon icon="play-fill" /> Play
          </b-btn>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <TrackList :tracks="album.tracks" />
      </div>
    </div>
  </div>
</template>
<style scoped>
  .image-container {
    max-width: 50%;
  }
</style>
<script lang="ts">
  import Vue from 'vue'
  import TrackList from '@/library/TrackList.vue'
  import { Album } from '@/shared/api'

  export default Vue.extend({
    components: {
      TrackList,
    },
    props: {
      id: { type: String, required: true }
    },
    data() {
      return {
        album: null as null | Album,
      }
    },
    async mounted() {
      this.album = await this.$api.getAlbumDetails(this.id)
    },
    methods: {
      play() {
        if (this.album?.tracks) {
          return this.$store.dispatch('player/playQueue', {
            index: 0,
            queue: this.album.tracks,
          })
        }
      },
    }
  })
</script>
