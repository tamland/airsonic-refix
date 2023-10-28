<template>
  <div :class="{'visible': visible}" class="player elevated d-flex">
    <div class="flex-fill">
      <ProgressBar v-if="track" style="margin-bottom: -5px; margin-top: -9px" />

      <div class="row align-items-center m-0" style="padding-top: -10px">
        <!-- Track info --->
        <div class="col p-0 d-flex flex-nowrap align-items-center justify-content-start" style="width: 0; min-width: 0">
          <template v-if="track">
            <router-link :to="{ name: 'queue' }" style="padding: 12px">
              <img v-if="track.image" width="52" height="52" :src="track.image">
              <img v-else width="52" height="52" src="@/shared/assets/fallback.svg">
            </router-link>
            <div style="min-width: 0">
              <div class="text-truncate">
                {{ streamTitle || track.title }}
              </div>
              <div class="text-truncate text-muted">
                {{ formatArtists(track.artists || []) || track.album }}
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
              <template v-if="track && track.isPodcast">
                <b-button id="player-playback-rate-btn" variant="icon" title="Speed" class="mb-1">
                  {{ playbackRate }}x
                </b-button>
                <b-popover target="player-playback-rate-btn" placement="top" triggers="click blur" no-fade>
                  <Slider class="pt-2" style="height: 120px;" direction="btt"
                          :min="0.8" :max="2" :step="0.1"
                          :value="playbackRate"
                          @input="setPlaybackRate"
                  />
                </b-popover>
              </template>
              <b-button
                title="Favourite"
                variant="link" class="m-0"
                :disabled="track && track.isStream"
                @click="toggleFavourite"
              >
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
              <b-dropdown-text v-if="track && track.isPodcast">
                <div class="d-flex justify-content-between align-items-center">
                  <strong>Speed</strong>
                  <Slider class="px-3" style="width: 120px;"
                          :min="0.7" :max="2" :step="0.1"
                          :value="playbackRate" @input="setPlaybackRate"
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
  import { defineComponent } from 'vue'
  import ProgressBar from '@/player/ProgressBar.vue'
  import { useFavouriteStore } from '@/library/favourite/store'
  import { formatArtists } from '@/shared/utils'
  import { BPopover } from 'bootstrap-vue'

  export default defineComponent({
    components: {
      BPopover,
      ProgressBar,
    },
    setup() {
      return {
        favouriteStore: useFavouriteStore(),
      }
    },
    computed: {
      visible() {
        return this.$store.state.player.queue.length > 0
      },
      isPlaying() {
        return this.$store.state.player.isPlaying
      },
      volume() {
        return this.$store.state.player.volume
      },
      isMuted() {
        return this.$store.state.player.volume <= 0.0
      },
      repeatActive(): boolean {
        return this.$store.state.player.repeat
      },
      shuffleActive(): boolean {
        return this.$store.state.player.shuffle
      },
      playbackRate(): number {
        return this.$store.getters['player/playbackRate']
      },
      isFavourite(): boolean {
        return this.track && !!this.favouriteStore.tracks[this.track.id]
      },
      track() {
        return this.$store.getters['player/track']
      },
      streamTitle() {
        return this.$store.state.streamTitle
      },
      documentTitle(): string {
        return [
          this.streamTitle || this.track?.title,
          formatArtists(this.track?.artists || []) || this.track?.album,
          'Airsonic (refix)'
        ].filter(x => !!x).join(' • ')
      }
    },
    watch: {
      documentTitle: {
        immediate: true,
        handler(value: string) {
          document.title = value
        }
      }
    },
    methods: {
      playPause() {
        return this.$store.dispatch('player/playPause')
      },
      next() {
        return this.$store.dispatch('player/next')
      },
      previous() {
        return this.$store.dispatch('player/previous')
      },
      setVolume(volume: any) {
        return this.$store.dispatch('player/setVolume', parseFloat(volume))
      },
      setPlaybackRate(value: number) {
        return this.$store.dispatch('player/setPlaybackRate', value)
      },
      toggleRepeat() {
        return this.$store.dispatch('player/toggleRepeat')
      },
      toggleShuffle() {
        return this.$store.dispatch('player/toggleShuffle')
      },
      toggleFavourite() {
        return this.favouriteStore.toggle('track', this.track.id)
      },
      formatArtists
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
