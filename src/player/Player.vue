<template>
  <div :class="{'visible': track}" class="player elevated d-flex">
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
                <span v-for="(artist, index) in track.artists" :key="artist.id">
                  <span v-if="index > 0">, </span>
                  <router-link :to="{name: 'artist', params: { id: artist.id }}" class="text-muted">{{ artist.name }}</router-link>
                </span>
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
          <div class="d-flex flex-nowrap justify-content-end pe-3">
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
              <b-button
                v-if="track && track.replayGain"
                title="ReplayGain"
                variant="link"
                class="m-0"
                :class="{ 'text-primary': replayGainMode !== ReplayGainMode.None }"
                @click="toggleReplayGain"
              >
                <IconReplayGain v-if="replayGainMode === ReplayGainMode.None" />
                <IconReplayGainTrack v-else-if="replayGainMode === ReplayGainMode.Track" />
                <IconReplayGainAlbum v-else-if="replayGainMode === ReplayGainMode.Album" />
              </b-button>
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
              <div class="d-flex justify-content-between align-items-center px-3 py-1">
                <span>Volume</span>
                <Slider class="p-3" style="width: 120px;"
                        :min="0" :max="1" :step="0.01" percent
                        :value="volume" @input="setVolume"
                />
              </div>
              <template v-if="track && track.isPodcast">
                <div class="d-flex justify-content-between align-items-center px-3 py-1">
                  <span>Speed</span>
                  <Slider class="px-3" style="width: 120px;"
                          :min="0.7" :max="2" :step="0.1"
                          :value="playbackRate" @input="setPlaybackRate"
                  />
                </div>
              </template>
              <div class="d-flex justify-content-between px-3 py-1">
                <span>Repeat</span>
                <SwitchInput :value="repeatActive" @input="toggleRepeat" />
              </div>
              <div class="d-flex justify-content-between px-3 py-1">
                <span>Shuffle</span>
                <SwitchInput :value="shuffleActive" @input="toggleShuffle" />
              </div>
              <div class="d-flex justify-content-between px-3 py-1">
                <span>Favourite</span>
                <b-button variant="link" class="m-0 px-2 py-0" @click.stop="toggleFavourite">
                  <Icon :icon="isFavourite ? 'heart-fill' : 'heart'" />
                </b-button>
              </div>
            </OverflowMenu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { ReplayGainMode } from './audio'
  import ProgressBar from '@/player/ProgressBar.vue'
  import { useFavouriteStore } from '@/library/favourite/store'
  import { formatArtists } from '@/shared/utils'
  import { BPopover } from 'bootstrap-vue'
  import SwitchInput from '@/shared/components/SwitchInput.vue'
  import IconReplayGain from '@/shared/components/IconReplayGain.vue'
  import IconReplayGainTrack from '@/shared/components/IconReplayGainTrack.vue'
  import IconReplayGainAlbum from '@/shared/components/IconReplayGainAlbum.vue'
  import { usePlayerStore } from '@/player/store'

  export default defineComponent({
    components: {
      SwitchInput,
      BPopover,
      ProgressBar,
      IconReplayGain,
      IconReplayGainTrack,
      IconReplayGainAlbum,
    },
    setup() {
      return {
        ReplayGainMode,
        favouriteStore: useFavouriteStore(),
        playerStore: usePlayerStore(),
      }
    },
    computed: {
      isPlaying() {
        return this.playerStore.isPlaying
      },
      volume() {
        return this.playerStore.volume
      },
      isMuted() {
        return this.playerStore.volume <= 0.0
      },
      replayGainMode(): ReplayGainMode {
        return this.playerStore.replayGainMode
      },
      repeatActive(): boolean {
        return this.playerStore.repeat
      },
      shuffleActive(): boolean {
        return this.playerStore.shuffle
      },
      playbackRate(): number {
        return this.playerStore.playbackRate
      },
      isFavourite(): boolean {
        return !!this.track && !!this.favouriteStore.tracks[this.track.id]
      },
      track() {
        return this.playerStore.track
      },
      streamTitle() {
        return this.playerStore.streamTitle
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
        return this.playerStore.playPause()
      },
      next() {
        return this.playerStore.next()
      },
      previous() {
        return this.playerStore.previous()
      },
      setVolume(volume: any) {
        return this.playerStore.setVolume(parseFloat(volume))
      },
      toggleReplayGain() {
        return this.playerStore.toggleReplayGain()
      },
      setPlaybackRate(value: number) {
        return this.playerStore.setPlaybackRate(value)
      },
      toggleRepeat() {
        return this.playerStore.toggleRepeat()
      },
      toggleShuffle() {
        return this.playerStore.toggleShuffle()
      },
      toggleFavourite() {
        return this.favouriteStore.toggle('track', this.track!.id)
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
