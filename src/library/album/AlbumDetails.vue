<template>
  <div v-if="album">
    <div class="d-flex mb-3">
      <div class="mr-3 mr-md-4 image-container">
        <img v-if="album.image" class="img-fluid" height="300" width="300" :src="album.image">
        <img v-else class="img-fluid" height="300" width="300" src="@/shared/assets/fallback.svg">
      </div>
      <div>
        <h1>{{ album.name }}</h1>
        <p>
          by
          <router-link :to="{name: 'artist', params: { id: album.artistId }}">
            {{ album.artist }}
          </router-link>
          <span v-if="album.year"> • {{ album.year }}</span>
          <span v-if="album.genreId"> •
            <router-link :to="{name: 'genre', params: { id: album.genreId }}">
              {{ album.genreId }}
            </router-link>
          </span>
        </p>
        <div class="text-nowrap">
          <b-button variant="secondary" class="mr-2" @click="play">
            <Icon icon="play-fill" /> Play
          </b-button>
          <b-button variant="secondary" class="mr-2" @click="toggleStar">
            <Icon :icon="album.starred ? 'star-fill' : 'star'" />
          </b-button>
          <b-dropdown variant="secondary" boundary="window" no-caret toggle-class="px-1">
            <template #button-content>
              <Icon icon="three-dots-vertical" />
            </template>
            <b-dropdown-item-btn @click="setNextInQueue">
              Play next
            </b-dropdown-item-btn>
            <b-dropdown-item-btn @click="addToQueue">
              Add to queue
            </b-dropdown-item-btn>
          </b-dropdown>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <TrackList :tracks="album.tracks" no-album />
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
  import TrackList from '@/library/track/TrackList.vue'
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
        if (this.album) {
          return this.$store.dispatch('player/playTrackList', {
            index: 0,
            tracks: this.album.tracks,
          })
        }
      },
      setNextInQueue() {
        if (this.album) {
          return this.$store.dispatch('player/setNextInQueue', this.album.tracks)
        }
      },
      addToQueue() {
        if (this.album) {
          return this.$store.dispatch('player/addToQueue', this.album.tracks)
        }
      },
      toggleStar() {
        if (this.album) {
          const value = !this.album.starred
          this.album.starred = value
          return value
            ? this.$api.starAlbum(this.album.id)
            : this.$api.unstarAlbum(this.album.id)
        }
      },
    }
  })
</script>
