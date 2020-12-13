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
      <InfiniteList v-slot="{ items }" :load="loadAlbums">
        <AlbumList :items="items" />
      </InfiniteList>
    </template>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import TrackList from '@/library/TrackList.vue'
  import InfiniteList from '@/shared/components/InfiniteList.vue'

  export default Vue.extend({
    components: {
      AlbumList,
      TrackList,
      InfiniteList,
    },
    props: {
      id: { type: String, required: true },
      section: { type: String, default: '' },
    },
    data() {
      return {
        tracks: null as null | any[],
      }
    },
    created() {
      this.$api.getTracksByGenre(this.id).then(result => {
        this.tracks = result
      })
    },
    methods: {
      loadAlbums(offset: number) {
        return this.$api.getAlbumsByGenre(this.id, 50, offset)
      }
    }
  })
</script>
