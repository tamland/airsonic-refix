<template>
  <ContentLoader v-slot :loading="item == null">
    <Hero :image="item.image">
      <small>Artist</small>
      <h1 class="display-5 fw-bold">
        {{ item.name }}
      </h1>
      <div class="d-flex flex-wrap align-items-center">
        <span class="text-nowrap">
          <strong>{{ item.albumCount }}</strong> albums
        </span>
        <span class="mx-2">•</span>
        <span class="text-nowrap">
          <strong>{{ item.trackCount }}</strong> tracks
        </span>

        <template v-if="item.genres.length > 0">
          <span class="mx-2">•</span>
          <span v-for="({ name: genre }, index) in item.genres" :key="genre">
            <span v-if="index > 0">, </span>
            <router-link :to="{name: 'genre', params: { id: genre }}">
              {{ genre }}
            </router-link>
          </span>
        </template>

        <template v-if="item.lastFmUrl || item.musicBrainzUrl">
          <span class="mx-2">•</span>
          <div class="d-flex flex-nowrap">
            <ExternalLink v-if="item.lastFmUrl" :href="item.lastFmUrl" class="btn btn-link p-0 me-2" title="Last.fm">
              <IconLastFm />
            </ExternalLink>
            <ExternalLink v-if="item.musicBrainzUrl" :href="item.musicBrainzUrl" class="btn btn-link me-2 p-0" title="MusicBrainz">
              <IconMusicBrainz />
            </ExternalLink>
          </div>
        </template>
      </div>

      <OverflowFade v-if="item.description" class="mt-3">
        {{ item.description }}
      </OverflowFade>

      <div class="text-nowrap mt-3">
        <b-button variant="light" :disabled="item.topTracks.length === 0" class="me-2" @click="playNow">
          <Icon icon="play" /> Play
        </b-button>
        <b-button variant="transparent" :disabled="item.topTracks.length === 0" class="me-2" title="Shuffle" @click="shuffleNow">
          <Icon icon="shuffle" />
        </b-button>
        <b-button variant="transparent" class="me-2" title="Favourite" @click="toggleFavourite">
          <Icon :icon="isFavourite ? 'heart-fill' : 'heart'" />
        </b-button>
      </div>
    </Hero>

    <template v-if="item.topTracks.length > 0">
      <div class="d-flex justify-content-between mt-5 mb-2">
        <h3 class="my-0">
          Top tracks
        </h3>
        <router-link :to="{name: 'artist-tracks', params: { id }}">
          View all
        </router-link>
      </div>
      <TrackList :tracks="item.topTracks" no-artist />
    </template>

    <template v-for="({ releaseType, albums: releaseTypeAlbums }) in albums">
      <div :key="`${releaseType}-h`" class="d-flex justify-content-between mt-5 mb-2">
        <h3 class="my-0">
          {{ formatReleaseType(releaseType) }}
        </h3>
        <b-button variant="link" class="p-0" @click="toggleAlbumSortOrder">
          <Icon icon="arrow-up-down" />
        </b-button>
      </div>
      <AlbumList :key="`${releaseType}-body`" :items="releaseTypeAlbums">
        <template #text="{ year }">
          {{ year || 'Unknown' }}
        </template>
      </AlbumList>
    </template>

    <template v-if="item.similarArtist.length > 0">
      <h3 class="mt-5">
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
  import { useFavouriteStore } from '@/library/favourite/store'
  import OverflowFade from '@/shared/components/OverflowFade.vue'
  import { Album } from '@/shared/api'
  import { orderBy } from 'lodash-es'
  import { useMainStore } from '@/shared/store'
  import IconLastFm from '@/shared/components/IconLastFm.vue'
  import IconMusicBrainz from '@/shared/components/IconMusicBrainz.vue'
  import { usePlayerStore } from '@/player/store'

  export default defineComponent({
    components: {
      IconMusicBrainz,
      IconLastFm,
      AlbumList,
      ArtistList,
      OverflowFade,
      TrackList,
    },
    props: {
      id: { type: String, required: true }
    },
    setup() {
      return {
        mainStore: useMainStore(),
        favouriteStore: useFavouriteStore(),
        playerStore: usePlayerStore(),
      }
    },
    data() {
      return {
        item: null as any,
      }
    },
    computed: {
      isFavourite(): boolean {
        return !!this.favouriteStore.artists[this.id]
      },
      albums(): { releaseType: string, albums: Album[] }[] {
        const sorted: Album[] = (orderBy(this.item?.albums ?? [], 'year', this.mainStore.artistAlbumSortOrder) || [])
        const grouped = Object.groupBy(sorted, ({ releaseTypes }) => (releaseTypes[0] || 'Album')) || {}
        const groupOrder = ['Album', 'EP', 'Single']
        const groups = Object.entries(grouped).sort(([aType], [bType]) => {
          const [a, b] = [groupOrder.indexOf(aType), groupOrder.indexOf(bType)]
          if (a === -1 && b === -1) return 0
          if (a === -1) return 1
          if (b === -1) return -1
          return a - b
        })
        return groups.map(([releaseType, albums]) => ({ releaseType, albums: albums || [] }))
      },
    },
    watch: {
      id: {
        immediate: true,
        async handler(value: string) {
          this.item = null
          this.item = await this.$api.getArtistDetails(value)
        }
      }
    },
    methods: {
      formatReleaseType(value: string) {
        switch (value.toUpperCase()) {
        case 'ALBUM': return 'Albums'
        case 'EP': return 'EPs'
        case 'SINGLE': return 'Singles'
        case 'COMPILATION': return 'Compilations'
        default: return value
        }
      },
      playNow() {
        return this.playerStore.playNow(this.item.topTracks)
      },
      shuffleNow() {
        return this.playerStore.shuffleNow(this.item.topTracks)
      },
      toggleFavourite() {
        return this.favouriteStore.toggle('artist', this.id)
      },
      toggleAlbumSortOrder() {
        this.mainStore.toggleArtistAlbumSortOrder()
      }
    }
  })
</script>
