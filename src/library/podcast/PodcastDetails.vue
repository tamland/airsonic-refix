<template>
  <ContentLoader v-slot :loading="podcast == null">
    <Hero :image="podcast.image">
      <h1>
        {{ podcast.name }}
      </h1>
      <p>{{ podcast.description }}</p>
      <div>
        <b-button variant="secondary" class="mr-2" :disabled="playableTracks.length === 0" @click="play">
          <Icon icon="play" /> Play
        </b-button>
        <OverflowMenu class="px-1">
          <ContextMenuItem icon="x" variant="danger" @click="deletePodcast">
            Delete
          </ContextMenuItem>
        </OverflowMenu>
      </div>
    </Hero>

    <BaseTable v-if="podcast.tracks.length > 0">
      <BaseTableHead>
        <th class="text-right d-none d-md-table-cell">
          Duration
        </th>
      </BaseTableHead>
      <tbody>
        <tr v-for="(item, index) in podcast.tracks" :key="index"
            :class="{'active': item.id === playingTrackId, 'disabled': item.isUnavailable}"
            @click="playTrack(item)">
          <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
          <CellTitle :track="item">
            {{ item.title }} <Icon v-if="item.playCount > 0" icon="check" />
          </CellTitle>
          <CellDuration :track="item" />
          <CellActions :track="item" />
        </tr>
      </tbody>
    </BaseTable>
    <EmptyIndicator v-else />
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import CellTrackNumber from '@/library/track/CellTrackNumber.vue'
  import CellActions from '@/library/track/CellActions.vue'
  import CellDuration from '@/library/track/CellDuration.vue'
  import CellTitle from '@/library/track/CellTitle.vue'
  import BaseTable from '@/library/track/BaseTable.vue'
  import BaseTableHead from '@/library/track/BaseTableHead.vue'
  import { Track } from '@/shared/api'

  export default defineComponent({
    components: {
      BaseTableHead,
      BaseTable,
      CellTitle,
      CellDuration,
      CellActions,
      CellTrackNumber
    },
    props: {
      id: { type: String, required: true },
    },
    data() {
      return {
        podcast: null as null | any,
      }
    },
    computed: {
      isPlaying(): boolean {
        return this.$store.getters['player/isPlaying']
      },
      playingTrackId(): any {
        return this.$store.getters['player/trackId']
      },
      playableTracks(): Track[] {
        return this.podcast.tracks.filter((x: any) => !x.isUnavailable)
      }
    },
    async created() {
      this.podcast = await this.$api.getPodcast(this.id)
    },
    methods: {
      async play() {
        return this.$store.dispatch('player/playTrackList', {
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
        this.podcast = null
        await this.$api.deletePodcast(this.id)
        return this.$router.replace({ name: 'podcasts' })
      }
    }
  })
</script>
