<template>
  <div :class="{'visible': visible}" class="player elevated d-flex">
    <div v-if="track" class="d-none d-sm-block">
      <router-link :to="track.albumId ? {name: 'album', params: {id: track.albumId}} : ''">
        <img v-if="track.image" width="80px" height="80px" :src="track.image">
        <img v-else width="80px" height="80px" src="@/shared/assets/fallback.svg">
      </router-link>
    </div>
    <div class="flex-fill">
      <!-- Progress --->
      <div class="progress2" @click="seek">
        <b-progress :value="progress" :max="100" height="4px" />
      </div>
      <div class="row align-items-center m-0" style="height: 100%">
        <!-- Track info --->
        <div class="col p-0 pl-3" style="min-width: 0; width: 0;">
          <template v-if="track">
            <div class="text-truncate">
              {{ track.title }}
            </div>
            <div class="text-truncate">
              {{ track.artist }}
            </div>
          </template>
        </div>

        <!-- Controls--->
        <div class="col-auto p-0">
          <b-button variant="link" class="m-2 d-none d-sm-inline-block" @click="previous">
            <Icon icon="skip-start-fill" />
          </b-button>
          <b-button variant="link" size="lg" class="m-2" @click="playPause">
            <Icon :icon="isPlaying ? 'pause-fill' : 'play-fill'" />
          </b-button>
          <b-button variant="link" class="m-2" @click="next">
            <Icon icon="skip-end-fill" />
          </b-button>
        </div>

        <!-- Time --->
        <div class="col p-0 d-none d-sm-block" style="min-width: 0; width: 0;">
          <div v-if="track" class="pr-3 text-right text-truncate">
            {{ $formatDuration(currentTime) }} / {{ $formatDuration(duration) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .progress2 {
    cursor: pointer;
  }
  .player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0;
    transition: 0.5s
  }
  .visible {
    height: 80px;
  }
</style>
<script lang="ts">
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default Vue.extend({
    data() {
      return {

      }
    },
    computed: {
      ...mapState('player', {
        isPlaying: (state: any) => state.isPlaying,
        currentTime: (state: any) => state.currentTime,
        duration: (state: any) => state.duration,
        visible: (state: any) => state.queue.length > 0,
      }),
      ...mapGetters('player', [
        'track',
        'progress',
      ]),
    },
    methods: {
      ...mapActions('player', [
        'playPause',
        'next',
        'previous',
      ]),
      seek(event: any) {
        if (event.target) {
          const width = event.currentTarget.clientWidth
          const value = event.offsetX / width
          return this.$store.dispatch('player/seek', value)
        }
      },
    }
  })
</script>
