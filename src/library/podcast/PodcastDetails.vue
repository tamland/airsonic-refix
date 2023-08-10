<template>
  <ContentLoader v-slot :loading="podcast == null">
    <Hero :image="podcast.image">
      <h1>
        {{ podcast.name }}
      </h1>
      <OverflowFade v-if="podcast.description" class="mb-3">
        {{ podcast.description }}
      </OverflowFade>
      <div class="text-nowrap">
        <b-button variant="secondary" class="mr-2" :disabled="playableTracks.length === 0" @click="playNow">
          <Icon icon="play" /> Play
        </b-button>
        <b-button variant="secondary" :disabled="playableTracks.length === 0" @click="shuffleNow">
          <Icon icon="shuffle" /> Shuffle
        </b-button>
        <OverflowMenu class="px-1">
          <ContextMenuItem icon="trash" variant="danger" @click="deletePodcast">
            Delete
          </ContextMenuItem>
        </OverflowMenu>
      </div>
    </Hero>

    <BaseTable v-if="podcast?.tracks.length > 0" ref="el">
      <BaseTableHead>
        <th class="text-right d-none d-md-table-cell">
          Duration
        </th>
      </BaseTableHead>
      <tbody>
        <tr v-for="item in podcast?.tracks.slice(0, tracksEnd)" :key="`${item.id}-${item.episodeStatus}`" :class="{'active': item.id === playingTrackId, 'disabled': item.isUnavailable}" @click="playTrack(item)">
          <td v-if="item.episodeStatus === 'downloading'" class="">
            <Icon icon="repeat" spin class="text-warning h4" />
          </td>
          <CellTrackNumber v-else :active="item.id === playingTrackId && isPlaying" :value="item.track" />
          <CellTitle :track="item">
            {{ item.title }} <Icon v-if="item.playCount > 0" icon="check" />
          </CellTitle>
          <CellDuration :track="item" />
          <CellActions :track="item">
            <ContextMenuItem v-if="item.isUnavailable" icon="download" variant="warning" @click="downloadEpisode(item, item.episodeStatus === 'downloading')">
              {{ item.episodeStatus === 'downloading' ? 'ReDownload' : 'Download' }} Episode
            </ContextMenuItem>
            <template v-else>
              <b-dropdown-divider />
              <ContextMenuItem icon="trash" variant="danger" @click="deleteEpisode(item)">
                Delete Episode
              </ContextMenuItem>
            </template>
          </CellActions>
        </tr>
      </tbody>
    </BaseTable>
    <EmptyIndicator v-else />
    <InfiniteLoader :loading="loading" :has-more="hasMore" @load-more="loadMore" />
  </ContentLoader>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { usePodcastStore } from '@/library/podcast/store'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import CellDuration from '@/library/track/CellDuration.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import OverflowFade from '@/shared/components/OverflowFade.vue'
  import { Podcast, Track, UnsupportedOperationError } from '@/shared/api'

  export default defineComponent({
    components: {
      BaseTableHead,
      BaseTable,
      CellTitle,
      CellDuration,
      CellActions,
      CellTrackNumber,
      OverflowFade,
    },
    props: {
      id: { type: String, required: true },
    },
    setup() {
      return { podcastStore: usePodcastStore() }
    },
    data() {
      return {
        loading: false,
        hasMore: true,
        tracksEnd: 25,
        traksStep: 25,
        showAddModal: false,
        unsupported: false,
      }
    },
    computed: {
      podcast(): null | Podcast {
        return this.podcastStore.getPodcast(this.id) || null
      },
      isPlaying(): boolean {
        return this.$store.getters['player/isPlaying']
      },
      playingTrackId(): any {
        return this.$store.getters['player/trackId']
      },
      playableTracks(): Track[] {
        return this.podcast?.tracks?.filter((x: any) => !x.isUnavailable) || []
      }
    },
    async created() {
      try {
        await this.podcastStore.load()
      } catch (err) {
        if (err instanceof UnsupportedOperationError) {
          this.unsupported = true
          return
        }
        throw err
      }
    },
    methods: {
      async loadMore() {
        this.loading = true
        const tracks = this.podcast?.tracks || []
        const tracksLen = tracks?.length || 0
        this.tracksEnd = this.tracksEnd + this.traksStep < tracksLen ? this.tracksEnd + this.traksStep : tracksLen
        this.hasMore = tracksLen > this.tracksEnd
        setTimeout(() => { this.loading = false }, 500)
      },
      async playNow() {
        return this.$store.dispatch('player/playNow', {
          tracks: this.playableTracks,
        })
      },
      async shuffleNow() {
        return this.$store.dispatch('player/shuffleNow', {
          tracks: this.playableTracks,
        })
      },
      async playTrack(track: any) {
        if (track.isUnavailable) {
          return
        }
        if (track.id === this.playingTrackId) {
          return this.$store.dispatch('player/playPause')
        }
        const index = this.playableTracks.findIndex((x: any) => x.id === track.id)
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks: this.playableTracks,
        })
      },
      async deletePodcast() {
        await this.podcastStore.delete(this.id)
        return this.$router.replace({ name: 'podcasts' })
      },
      async downloadEpisode(item: any, reDownload: boolean) {
        if (reDownload) {
          await this.podcastStore.redownloadEpisode(this.id, item.id)
          return
        }
        await this.podcastStore.downloadEpisode(this.id, item.id)
      },
      async deleteEpisode(item: any) {
        await this.podcastStore.deleteEpisode(this.id, item.id)
      },
    }
  })
</script>
