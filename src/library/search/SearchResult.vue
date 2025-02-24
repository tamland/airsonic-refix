<template>
  <div>
    <div v-if="result.albums.length > 0" class="mb-5">
      <h1 v-if="!type">
        Albums
        <router-link v-if="!type" :to="{params: {type: 'album'}, query: $route.query}" class="text-muted">
          <Icon icon="chevron-right" />
        </router-link>
      </h1>
      <AlbumList :items="result.albums" />
    </div>

    <div v-if="result.artists.length > 0" class="mb-5">
      <h1 v-if="!type">
        Artists
        <router-link v-if="!type" :to="{params: {type: 'artist'}, query: $route.query}" class="text-muted">
          <Icon icon="chevron-right" />
        </router-link>
      </h1>
      <ArtistList :items="result.artists" />
    </div>

    <div v-if="result.tracks.length > 0">
      <h1 v-if="!type">
        Tracks
        <router-link :to="{params: {type: 'track'}, query: $route.query}" class="text-muted">
          <Icon icon="chevron-right" />
        </router-link>
      </h1>
      <TrackList :tracks="result.tracks" />
    </div>

    <EmptyIndicator v-if="!loading && !hasResult" label="No results" />

    <InfiniteLoader :loading="loading" :has-more="hasMore" @load-more="loadMore" />
  </div>
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
      query: { type: String, required: true },
      type: { type: String, default: null },
    },
    data() {
      return {
        result: {
          albums: [] as any[],
          artists: [] as any[],
          tracks: [] as any[],
        },
        loading: false,
        offset: 0 as number,
        hasMore: true,
      }
    },
    computed: {
      key(): string {
        return '' + this.type + this.query
      },
      hasResult(): boolean {
        return this.result.albums.length > 0 ||
          this.result.artists.length > 0 ||
          this.result.tracks.length > 0
      },
    },
    watch: {
      key: {
        immediate: true,
        handler() {
          this.result.artists = []
          this.result.albums = []
          this.result.tracks = []
          this.offset = 0
          this.hasMore = true
          this.loading = false
        }
      },
    },
    methods: {
      async loadMore() {
        this.loading = true
        const result = await this.$api.search(this.query, this.type, this.offset)
        const size = result.albums.length + result.artists.length + result.tracks.length

        this.result.albums.push(...result.albums)
        this.result.artists.push(...result.artists)
        this.result.tracks.push(...result.tracks)

        this.offset += size
        this.hasMore = size > 0
        this.loading = false
      }
    }
  })
</script>
