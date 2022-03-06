<template>
  <div :class="{'visible': visible}" class="player elevated d-flex">
    <div class="flex-fill">
      <ProgressBar style="margin-bottom: -5px; margin-top: -9px" />

      <div class="row align-items-center m-0" style="padding-top: -10px">
        <!-- Track info --->
        <div class="col p-0 d-flex flex-nowrap align-items-center justify-content-start" style="width: 0; min-width: 0">
          <template v-if="track">
            <router-link :to="{ name: 'queue' }" style="padding: 12px">
              <img v-if="track.image" width="52px" height="52px" :src="track.image">
              <img v-else width="52px" height="52px" src="@/shared/assets/fallback.svg">
            </router-link>
            <div style="min-width: 0">
              <div class="text-truncate">
                {{ streamTitle || track.title }}
              </div>
              <div class="text-truncate text-muted">
                {{ track.artist || track.album }}
              </div>
            </div>
          </template>
        </div>

        <!-- Controls--->
        <div class="col-auto p-0">
          <b-button variant="link" class="m-2 d-none d-sm-inline-block" @click="previous">
            <Icon icon="skip-start" />
          </b-button>
          <b-button variant="link" size="lg" class="m-2" @click="playPause">
            <Icon :icon="isPlaying ? 'pause' : 'play'" />
          </b-button>
          <b-button variant="link" class="m-2" @click="next">
            <Icon icon="skip-end" />
          </b-button>
        </div>

        <!-- Controls right --->
        <div class="col-auto col-sm p-0">
          <div class="d-flex flex-nowrap justify-content-end pr-3">
            <div class="m-0 d-none d-md-inline-flex align-items-center">
              <b-button title="Favourite"
                        variant="link" class="m-0"
                        @click="toggleFavourite">
                <Icon :icon="isFavourite ? 'heart-fill' : 'heart'" />
              </b-button>
              <b-button id="player-volume-btn" variant="link" title="Volume">
                <Icon :icon="isMuted ? 'mute' : 'volume'" />
              </b-button>
              <b-popover target="player-volume-btn" placement="top" triggers="click blur" no-fade>
                <Slider class="pt-2" style="height: 120px;" direction="btt"
                        :min="0" :max="1" :step="0.01" percent
                        :value="volume" @input="setVolume"
                />
              </b-popover>
              <b-button title="Shuffle"
                        variant="link" class="m-0" :class="{ 'text-primary': shuffleActive }"
                        @click="toggleShuffle">
                <Icon icon="shuffle" />
              </b-button>
              <b-button title="Repeat"
                        variant="link" class="m-0" :class="{ 'text-primary': repeatActive }"
                        @click="toggleRepeat">
                <Icon icon="repeat" />
              </b-button>
            </div>
            <OverflowMenu class="d-md-none">
              <b-dropdown-text>
                <div class="d-flex justify-content-between align-items-center">
                  <strong>Volume</strong>
                  <Slider class="px-3" style="width: 120px;"
                          :min="0" :max="1" :step="0.01" percent
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
              <b-dropdown-text>
                <div class="d-flex justify-content-between">
                  <strong>Favourite</strong>
                  <b-button variant="link" class="m-0 px-2 py-0" @click.stop="toggleFavourite">
                    <Icon :icon="isFavourite ? 'heart-fill' : 'heart'" />
                  </b-button>
                </div>
              </b-dropdown-text>
            </OverflowMenu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import ProgressBar from '@/player/ProgressBar.vue'

  export default Vue.extend({
    components: {
      ProgressBar,
    },
    computed: {
      ...mapState('player', {
        isPlaying: (state: any) => state.isPlaying,
        repeatActive: (state: any) => state.repeat,
        shuffleActive: (state: any) => state.shuffle,
        visible: (state: any) => state.queue.length > 0,
        volume: (state: any) => state.volume,
        isMuted: (state: any) => state.volume <= 0.0,
        streamTitle: (state: any) => state.streamTitle,
      }),
      ...mapGetters('player', [
        'track',
      ]),
      isFavourite(): boolean {
        return this.track && !!this.$store.state.favourites.tracks[this.track.id]
      },
    },
    watch: {
      track: {
        immediate: true,
        handler(track: any) {
          document.title = [track?.title, track?.artist || track?.album, 'Airsonic (refix)']
            .filter(x => !!x).join(' • ')
        }
      }
    },
    methods: {
      ...mapActions('player', [
        'playPause',
        'next',
        'previous',
        'toggleRepeat',
        'toggleShuffle',
      ]),
      setVolume(volume: any) {
        return this.$store.dispatch('player/setVolume', parseFloat(volume))
      },
      toggleFavourite() {
        return this.$store.dispatch('favourites/toggle', { id: this.track.id, type: 'track' })
      },
    }
  })
</script>
<style scoped>
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
  .icon {
    display: flex;
    align-items: center;
  }
</style>
