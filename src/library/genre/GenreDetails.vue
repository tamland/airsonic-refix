<template>
  <div>
    <h1>{{ id }}</h1>
    <ul class="nav-underlined">
      <li>
        <router-link :to="{... $route, params: { }}">
          Albums
        </router-link>
      </li>
      <li>
        <router-link :to="{... $route, params: { section: 'tracks' }}">
          Tracks
        </router-link>
      </li>
    </ul>
    <template v-if="section === 'tracks'">
      <ContentLoader v-slot :loading="tracks == null">
        <TrackList :tracks="tracks" />
      </ContentLoader>
    </template>
    <template v-else>
      <ContentLoader v-slot :loading="albums == null">
        <AlbumList :items="albums" />
      </ContentLoader>
    </template>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import TrackList from '@/library/TrackList.vue'

  export default Vue.extend({
    components: {
      AlbumList,
      TrackList,
    },
    props: {
      id: { type: String, required: true },
      section: { type: String, default: '' },
    },
    data() {
      return {
        albums: null as null | any[],
        tracks: null as null | any[],
      }
    },
    created() {
      this.$api.getAlbumsByGenre(this.id).then(result => {
        this.albums = result
      })
      this.$api.getTracksByGenre(this.id).then(result => {
        this.tracks = result
      })
    }
  })
</script>
