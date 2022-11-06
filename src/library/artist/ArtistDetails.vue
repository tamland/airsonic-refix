<template>
  <ContentLoader v-slot :loading="item == null">
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
