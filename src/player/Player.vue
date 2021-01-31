<template>
  <div :class="{'visible': visible}" class="player elevated d-flex">
    <div class="flex-fill">
      <!-- Progress --->
      <div class="progress2" @click="seek">
        <b-progress :value="progress" :max="100" height="4px" />
      </div>
      <div class="row align-items-center m-0">
        <!-- Track info --->
        <div class="col p-0 d-flex flex-nowrap align-items-center justify-content-start" style="width: 0; min-width: 0">
          <template v-if="track">
            <router-link :to="{ name: 'queue' }">
              <template v-if="track.image">
                <img class="d-sm-none" width="64px" height="64px" :src="track.image">
                <img class="d-none d-sm-inline-block" width="74px" height="74px" :src="track.image">
              </template>
              <template v-else>
                <img class="d-sm-none" width="64px" height="64px" src="@/shared/assets/fallback.svg">
                <img class="d-none d-sm-inline-block" width="74px" height="74px" src="@/shared/assets/fallback.svg">
              </template>
            </router-link>

            <div class="pl-3" style="min-width: 0">
              <div class="text-truncate">
                {{ track.title }}
              </div>
              <div class="text-truncate text-muted">
                {{ track.artist || track.album || track.description }}
              </div>
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

        <!-- Controls right --->
        <div class="col-auto col-sm p-0">
          <div class="d-flex flex-nowrap justify-content-end pr-3">
            <div class="m-0 d-none d-md-inline-flex align-items-center">
              <b-button variant="link" @click="toggleMute">
                <Icon :icon="muteActive ? 'volume-mute-fill' : 'volume-up-fill'" />
              </b-button>
              <b-form-input type="range" min="0" max="1" step="0.05"
                            style="width: 120px; min-width: 0; padding-right: 0.75rem"
                            :title="`Volume: ${Math.round(volume * 100)}%`"
                            :value="muteActive ? 0.0 : volume" @input="setVolume" />
              <b-button variant="link"
                        class="m-0" :class="{ 'text-primary': shuffleActive }"
                        @click="toggleShuffle">
                <Icon icon="shuffle" />
              </b-button>
              <b-button variant="link"
                        class="m-0" :class="{ 'text-primary': repeatActive }"
                        @click="toggleRepeat">
                <Icon icon="arrow-repeat" />
              </b-button>
            </div>
            <OverflowMenu class="d-md-none">
              <b-dropdown-text>
                <div class="d-flex justify-content-between">
                  <strong>Volume</strong>
                  <b-form-input
                    class="px-2" style="width: 120px"
                    type="range" min="0" max="1" step="0.05"
                    :value="volume" @input="setVolume"
                  />
                </div>
              </b-dropdown-text>
              <b-dropdown-text>
                <div class="d-flex justify-content-between">
                  <strong>Repeat</strong>
                  <b-form-checkbox switch :checked="repeatActive" @change="toggleRepeat" />
                </div>
              </b-dropdown-text>
              <b-dropdown-text>
                <div class="d-flex justify-content-between">
                  <strong>Shuffle</strong>
                  <b-form-checkbox switch :checked="shuffleActive" @change="toggleShuffle" />
                </div>
              </b-dropdown-text>
            </OverflowMenu>
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
    max-height: 0;
    transition: max-height 0.5s;
  }
  .visible {
    height: auto;
    max-height: 100px;
  }
  .b-icon {
    display: flex;
    align-items: center;
  }
</style>
<script lang="ts">
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default Vue.extend({
    computed: {
      ...mapState('player', {
        isPlaying: (state: any) => state.isPlaying,
        currentTime: (state: any) => state.currentTime,
        repeatActive: (state: any) => state.repeat,
        shuffleActive: (state: any) => state.shuffle,
        muteActive: (state: any) => state.mute,
        visible: (state: any) => state.queue.length > 0,
        volume: (state: any) => state.volume,
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
        'toggleRepeat',
        'toggleShuffle',
        'toggleMute',
      ]),
      seek(event: any) {
        if (event.target) {
          const width = event.currentTarget.clientWidth
          const value = event.offsetX / width
          return this.$store.dispatch('player/seek', value)
        }
      },
      setVolume(volume: any) {
        return this.$store.dispatch('player/setVolume', parseFloat(volume))
      },
    }
  })
</script>
