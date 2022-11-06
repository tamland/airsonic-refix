<template>
  <ContentLoader v-slot :loading="podcast ==null">
    <div class="d-flex justify-content-between">
      <h1 class="text-truncate">
        {{ podcast.name }}
      </h1>
      <OverflowMenu>
        <ContextMenuItem icon="x" variant="danger" @click="deletePodcast">
          Delete
        </ContextMenuItem>
      </OverflowMenu>
    </div>
    <p>{{ podcast.description }}</p>

    <BaseTable>
      <BaseTableHead>
        <th class="text-right d-none d-md-table-cell">
          Duration
        </th>
      </BaseTableHead>
      <tbody>
        <tr v-for="(item, index) in podcast.tracks" :key="index"
            :class="{'active': item.id === playingTrackId, 'disabled': !item.url}"
            @click="play(item)">
          <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
          <CellTitle :track="item">
            {{ item.title }} <Icon v-if="item.playCount > 0" icon="check" />
          </CellTitle>
          <CellDuration :track="item" />
          <CellActions :track="item" />
        </tr>
      </tbody>
    </BaseTable>
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
    },
    async created() {
      this.podcast = await this.$api.getPodcast(this.id)
    },
    methods: {
      async play(track: any) {
        if (!track.url) {
          return
        }
        if (track.id === this.playingTrackId) {
          return this.$store.dispatch('player/playPause')
        }
        const tracks = this.podcast.tracks.filter((x: any) => x.url)
        const index = tracks.findIndex((x: any) => x.id === track.id)
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks,
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
