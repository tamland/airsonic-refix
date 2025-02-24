<template>
  <div>
    <ul class="nav-underlined mb-3">
      <li>
        <router-link :to="{... $route, params: { section: 'albums' }}">
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
      <template v-if="section === 'artists'">
        <ArtistList v-if="details.artists.length > 0" :items="details.artists" />
        <EmptyIndicator v-else />
      </template>
      <template v-else-if="section === 'tracks'">
        <TrackList v-if="details.tracks.length > 0" :tracks="details.tracks" />
        <EmptyIndicator v-else />
      </template>
      <template v-else>
        <AlbumList v-if="details.albums.length > 0" :items="details.albums" />
        <EmptyIndicator v-else />
      </template>
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import ArtistList from '@/library/artist/ArtistList.vue'
  import TrackList from '@/library/track/TrackList.vue'
  import { useFavouriteStore } from '@/library/favourite/store'
  import { useApi } from '@/shared'

  export default defineComponent({
    components: {
      AlbumList,
      ArtistList,
      TrackList,
    },
    props: {
      section: { type: String, default: '' },
    },
    setup() {
      const api = useApi()
      const favouriteStore = useFavouriteStore()
      const details = ref<any>(null)
      watch(
        () => [favouriteStore],
        async() => {
          const result = await api.getFavourites()
          details.value = {
            albums: result.albums.filter((item: any) => favouriteStore.albums[item.id]),
            artists: result.artists.filter((item: any) => favouriteStore.artists[item.id]),
            tracks: result.tracks.filter((item: any) => favouriteStore.tracks[item.id]),
          }
        },
        { deep: true, immediate: true }
      )
      return {
        details
      }
    },
  })
</script>
