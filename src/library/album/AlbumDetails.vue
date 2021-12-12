<template>
  <div v-if="album">
    <div class="d-flex mb-3">
      <div class="mr-3 mr-md-4 image-container">
        <img v-if="album.image" class="img-fluid" height="300" width="300" :src="album.image">
        <img v-else class="img-fluid" height="300" width="300" src="@/shared/assets/fallback.svg">
      </div>
      <div>
        <h1>
          {{ album.name }}
          <b-button variant="link" class="p-0" @click="toggleFavourite">
            <Icon :icon="isFavourite ? 'heart-fill' : 'heart'" />
          </b-button>
        </h1>
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
            <Icon icon="play" /> Play
          </b-button>
          <b-dropdown variant="secondary" no-caret toggle-class="px-1">
            <template #button-content>
              <Icon icon="three-dots-vertical" />
            </template>
            <ContextMenuItem icon="plus" @click="setNextInQueue">
              Play next
            </ContextMenuItem>
            <ContextMenuItem icon="plus" @click="addToQueue">
              Add to queue
            </ContextMenuItem>
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
    computed: {
      isFavourite(): boolean {
        return !!this.$store.state.favourites.albums[this.id]
      }
    },
    async created() {
      this.album = await this.$api.getAlbumDetails(this.id)
    },
    methods: {
      play() {
        if (this.album) {
          return this.$store.dispatch('player/playTrackList', {
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
      toggleFavourite() {
        return this.$store.dispatch('favourites/toggle', { id: this.id, type: 'album' })
      },
    }
  })
</script>
<style scoped>
  .image-container {
    max-width: 50%;
  }
</style>
