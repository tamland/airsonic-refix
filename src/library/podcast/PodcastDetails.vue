<template>
  <ContentLoader v-slot :loading="podcast ==null">
    <h1>{{ podcast.name }}</h1>
    <p>{{ podcast.description }}</p>
    <table class="table table-hover table-borderless table-numbered">
      <thead>
        <tr>
          <th>
            #
          </th>
          <th class="text-left">
            Title
          </th>
          <th class="text-right d-none d-md-table-cell">
            Duration
          </th>
          <th class="text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in podcast.tracks"
            :key="index"
            :class="{'active': item.id === playingTrackId, 'disabled': !item.playable}"
            @click="click(item)">
          <td>
            <button>
              <Icon class="icon" :icon="isPlaying && item.id === playingTrackId ? 'pause-fill' :'play-fill'" />
              <span class="number">{{ item.track }}</span>
            </button>
          </td>
          <td>
            {{ item.title }}
            <div class="text-muted">
              <small>{{ item.description }}</small>
            </div>
          </td>
          <td class="text-right d-none d-md-table-cell">
            <template v-if="item.duration">
              {{ $formatDuration(item.duration) }}
            </template>
          </td>
          <td class="text-right" @click.stop="">
            <OverflowMenu :disabled="!item.playable" />
          </td>
        </tr>
      </tbody>
    </table>
  </ContentLoader>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  export default Vue.extend({
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
      async click(track: any) {
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
