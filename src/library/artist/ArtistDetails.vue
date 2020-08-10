<template>
  <div v-if="item">
    <div class="row">
      <div class="col col-xl-8">
        <h1>{{ item.name }}</h1>
        <p>{{ item.description }}</p>
        <ExternalLink v-if="item.lastFmUrl" :href="item.lastFmUrl" class="btn btn-secondary mr-2">
          Last.fm
        </ExternalLink>
        <ExternalLink
          v-if="item.musicBrainzUrl"
          :href="item.musicBrainzUrl"
          class="btn btn-secondary">
          MusicBrainz
        </ExternalLink>
      </div>
    </div>
    <h3 class="pt-5">
      Albums
    </h3>
    <AlbumList :items="item.albums" />

    <template v-if="item.similarArtist.length > 0">
      <h3 class="pt-5">
        Similar artists
      </h3>
      <ArtistList :items="item.similarArtist" />
    </template>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import ArtistList from '@/library/artist/ArtistList.vue'

  export default Vue.extend({
    components: {
      AlbumList,
      ArtistList,
    },
    props: {
      id: { type: String, required: true }
    },
    data() {
      return {
        item: null as any,
      }
    },
    watch: {
      id: {
        immediate: true,
        async handler(value: string) {
          this.item = null
          this.item = await this.$api.getArtistDetails(value)
        }
      }
    }
  })
</script>
