<template>
  <div>
    <h1>Favourites</h1>
    <ul class="nav-underlined">
      <li>
        <router-link :to="{... $route, params: { }}">
          Tracks
        </router-link>
      </li>
      <li>
        <router-link :to="{... $route, params: { section: 'artists' }}">
          Artists
        </router-link>
      </li>
      <li>
        <router-link :to="{... $route, params: { section: 'albums' }}">
          Albums
        </router-link>
      </li>
    </ul>
    <ContentLoader v-slot :loading="details == null">
      <ArtistList v-if="section === 'artists'" :items="details.artists" />
      <AlbumList v-else-if="section === 'tracks'" ::items="details.albums" />
      <TrackList v-else track-list :tracks="details.tracks" />
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import ArtistList from '@/library/artist/ArtistList.vue'
  import TrackList from '@/library/track/TrackList.vue'

  export default Vue.extend({
    components: {
      AlbumList,
      ArtistList,
      TrackList,
    },
    props: {
      section: { type: String, default: '' },
    },
    data() {
      return {
        details: null as any,
      }
    },
    watch: {
      '$store.state.favourites': {
        immediate: true,
        deep: true,
        async handler() {
          const result = await this.$api.getFavourites()
          const index = this.$store.state.favourites
          this.details = {
            albums: result.albums.filter((item: any) => index.albums[item.id]),
            artists: result.artists.filter((item: any) => index.artists[item.id]),
            tracks: result.tracks.filter((item: any) => index.tracks[item.id]),
          }
        }
      }
    }
  })
</script>
