<template>
  <div>
    <h1>Starred</h1>
    <ul class="nav-underlined">
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
    <ContentLoader v-slot :loading="result == null">
      <ArtistList v-if="section === 'artists'" :items="result.artists" />
      <TrackList v-else-if="section === 'tracks'" :tracks="result.tracks" />
      <AlbumList v-else :items="result.albums" />
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
        result: null as any,
      }
    },
    async created() {
      this.result = await this.$api.getStarred()
    }
  })
</script>
