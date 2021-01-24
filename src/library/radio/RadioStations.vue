<template>
  <div v-if="items">
    <h1>Radio</h1>
    <table class="table table-hover table-borderless table-numbered">
      <thead>
        <tr>
          <th>
            #
          </th>
          <th class="text-left">
            Title
          </th>
          <th class="text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items"
            :key="index"
            :class="{'active': item.id === playingTrackId}"
            @click="play(index)">
          <td>
            <button>
              <Icon class="icon" :icon="isPlaying && item.id === playingTrackId ? 'pause-fill' :'play-fill'" />
              <span class="number">{{ index + 1 }}</span>
            </button>
          </td>
          <td>
            {{ item.title }}
            <div>
              <small class="text-muted">
                {{ item.description }}
              </small>
            </div>
          </td>
          <td class="text-right">
            <TrackContextMenu :track="item" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import TrackContextMenu from '@/library/TrackContextMenu.vue'
  import { RadioStation } from '@/shared/api'
  import { mapGetters } from 'vuex'

  export default Vue.extend({
    components: {
      TrackContextMenu,
    },
    data() {
      return {
        items: [] as RadioStation[],
      }
    },
    computed: {
      ...mapGetters({
        playingTrackId: 'player/trackId',
        isPlaying: 'player/isPlaying',
      }),
    },
    async created() {
      this.items = await this.$api.getRadioStations()
    },
    methods: {
      play(index: number) {
        if (this.items[index].id === this.playingTrackId) {
          return this.$store.dispatch('player/playPause')
        }
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks: this.items
        })
      },
    }
  })
</script>
