<template>
  <div>
    <ul class="nav-underlined mb-3">
      <li>
        <router-link :to="{... $route, params: { }}">
          Albums
        </router-link>
      </li>
      <li>
        <router-link :to="{... $route, params: { section: 'artists' }}">
          Artists
        </router-link>
      </li>
      <li>
        <router-link :to="{... $route, params: { section: 'tracks' }}">
          Tracks
        </router-link>
      </li>
    </ul>
    <ContentLoader v-slot :loading="details == null">
      <ArtistList v-if="section === 'artists'" :items="details.artists" />
      <TrackList v-else-if="section === 'tracks'" :tracks="details.tracks" />
      <AlbumList v-else :items="details.albums" />
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
