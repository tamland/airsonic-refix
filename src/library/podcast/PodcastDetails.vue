<template>
  <ContentLoader v-slot :loading="podcast ==null">
    <h1>{{ podcast.name }}</h1>
    <p>{{ podcast.description }}</p>
    <BaseTable>
      <BaseTableHead>
        <th class="text-right d-none d-md-table-cell">
          Duration
        </th>
      </BaseTableHead>
      <tbody>
        <tr v-for="(item, index) in podcast.tracks" :key="index"
            :class="{'active': item.id === playingTrackId, 'disabled': !item.playable}"
            @click="play(item)">
          <CellTrackNumber :active="item.id === playingTrackId && isPlaying" :value="item.track" />
          <CellTitle :track="item" />
          <CellDuration :track="item" />
          <CellActions :track="item" />
        </tr>
      </tbody>
    </BaseTable>
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import { mapGetters } from 'vuex'
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
      ...mapGetters({
        playingTrackId: 'player/trackId',
        isPlaying: 'player/isPlaying',
      }),
    },
    async created() {
      this.podcast = await this.$api.getPodcast(this.id)
    },
    methods: {
      async play(track: any) {
        if (!track.playable) {
          return
        }
        const tracks = this.podcast.tracks.filter((x: any) => x.playable)
        const index = tracks.findIndex((x: any) => x.id === track.id)
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks,
        })
      },
    }
  })
</script>
