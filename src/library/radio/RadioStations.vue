<template>
  <div v-if="items">
    <h1>Radio</h1>
    <table class="table table-hover table-borderless">
      <thead>
        <tr>
          <th class="text-left">
            Title
          </th>
          <th class="text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index"
            :class="{'active': item.id === playingTrackId}">
          <td @click="play(index)">
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
        return this.$store.dispatch('player/playQueue', { index, queue: this.items })
      },
    }
  })
</script>
