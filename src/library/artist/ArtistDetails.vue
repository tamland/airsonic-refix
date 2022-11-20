<template>
  <ContentLoader v-slot :loading="item == null">
    <Hero :image="item.image">
      <h1>
        {{ item.name }}
        <b-button variant="link" class="p-0" @click="toggleFavourite">
          <Icon :icon="isFavourite ? 'heart-fill' : 'heart'" />
        </b-button>
      </h1>
      <p>{{ item.description }}</p>
      <div class="d-flex flex-wrap align-items-center">
        <b-button variant="secondary" class="mr-4" @click="play">
          <Icon icon="play" /> Play
        </b-button>
        <div class="d-none d-lg-block">
          <ExternalLink v-if="item.lastFmUrl" :href="item.lastFmUrl" class="mr-4">
            Last.fm <Icon icon="link" />
          </ExternalLink>
          <ExternalLink v-if="item.musicBrainzUrl" :href="item.musicBrainzUrl">
            MusicBrainz <Icon icon="link" />
          </ExternalLink>
        </div>
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

  export default defineComponent({
    components: {
      AlbumList,
      ArtistList,
      TrackList,
    },
    props: {
      id: { type: String, required: true }
    },
    data() {
      return {
        item: null as any,
      }
    },
    computed: {
      isFavourite(): boolean {
        return !!this.$store.state.favourites.artists[this.id]
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
      play() {
        return this.$store.dispatch('player/playTrackList', {
          tracks: this.item.topTracks,
        })
      },
      toggleFavourite() {
        return this.$store.dispatch('favourites/toggle', { id: this.id, type: 'artist' })
      },
    }
  })
</script>
