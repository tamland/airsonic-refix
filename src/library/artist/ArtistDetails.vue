<template>
  <ContentLoader v-slot :loading="item == null">
    <Hero :image="item.image">
      <h1>
        {{ item.name }}
        <b-button variant="link" class="p-0" @click="toggleFavourite">
          <Icon :icon="isFavourite ? 'heart-fill' : 'heart'" />
        </b-button>
      </h1>
      <div class="mb-3">
        <strong>{{ item.albumCount }}</strong> albums •
        <strong>{{ item.trackCount }}</strong> tracks
        <div v-if="item.genres.length > 0">
          <span v-for="(genre, index) in item.genres" :key="genre">
            <span v-if="index > 0">•</span>
            <router-link :to="{name: 'genre', params: { id: genre }}">
              {{ genre }}
            </router-link>
          </span>
        </div>
      </div>
      <p class="d-none d-sm-block">
        {{ item.description }}
      </p>
      <b-button variant="secondary" :disabled="item.topTracks.length === 0" class="mr-2" @click="playNow">
        <Icon icon="play" /> Play
      </b-button>
      <b-button variant="secondary" :disabled="item.topTracks.length === 0" @click="shuffleNow">
        <Icon icon="shuffle" /> Shuffle
      </b-button>
      <div class="d-none d-lg-inline-block">
        <ExternalLink v-if="item.lastFmUrl" :href="item.lastFmUrl" class="ml-4">
          Last.fm <Icon icon="link" />
        </ExternalLink>
        <ExternalLink v-if="item.musicBrainzUrl" :href="item.musicBrainzUrl" class="ml-4">
          MusicBrainz <Icon icon="link" />
        </ExternalLink>
      </div>
    </Hero>

    <template v-if="item.topTracks.length > 0">
      <h3 class="pt-5">
        Top tracks
      </h3>
      <TrackList :tracks="item.topTracks" no-artist />
    </template>

    <template v-if="item.albums.length > 0">
      <h3 class="pt-5">
        Albums
      </h3>
      <AlbumList :items="item.albums" />
    </template>

    <template v-if="item.similarArtist.length > 0">
      <h3 class="pt-5">
        Similar artists
      </h3>
      <ArtistList :items="item.similarArtist" />
    </template>
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import ArtistList from '@/library/artist/ArtistList.vue'
  import TrackList from '@/library/track/TrackList.vue'
  import { useFavouriteStore } from '@/library/favourite/store'

  export default defineComponent({
    components: {
      AlbumList,
      ArtistList,
      TrackList,
    },
    props: {
      id: { type: String, required: true }
    },
    setup() {
      return {
        favouriteStore: useFavouriteStore()
      }
    },
    data() {
      return {
        item: null as any,
      }
    },
    computed: {
      isFavourite(): boolean {
        return !!this.favouriteStore.artists[this.id]
      },
    },
    watch: {
      id: {
        immediate: true,
        async handler(value: string) {
          this.item = null
          this.item = await this.$api.getArtistDetails(value)
        }
      }
    },
    methods: {
      playNow() {
        return this.$store.dispatch('player/playNow', {
          tracks: this.item.topTracks,
        })
      },
      shuffleNow() {
        return this.$store.dispatch('player/shuffleNow', {
          tracks: this.item.topTracks,
        })
      },
      toggleFavourite() {
        return this.favouriteStore.toggle('artist', this.id)
      },
    }
  })
</script>
