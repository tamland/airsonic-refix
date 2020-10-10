<template>
  <ContentLoader v-slot :loading="result == null">
    <div v-if="result.artists.length > 0" class="mb-5">
      <h1>Artists</h1>
      <ArtistList :items="result.artists" />
    </div>
    <div v-if="result.albums.length > 0" class="mb-5">
      <h1>Albums</h1>
      <AlbumList :items="result.albums" />
    </div>
    <div v-if="result.tracks.length > 0">
      <h1>Tracks</h1>
      <TrackList :tracks="result.tracks" />
    </div>
  </ContentLoader>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import ArtistList from '@/library/artist/ArtistList.vue'
  import TrackList from '@/library/TrackList.vue'

  export default Vue.extend({
    components: {
      AlbumList,
      ArtistList,
      TrackList,
    },
    props: {
      query: { type: String, required: true }
    },
    data() {
      return {
        result: null as any,
      }
    },
    watch: {
      query: {
        immediate: true,
        handler(value: string) {
          this.$api.search(value).then(result => {
            this.result = result
          })
        }
      }
    },
  })
</script>
