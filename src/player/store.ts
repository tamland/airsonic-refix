import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { shuffle, shuffled, trackListEquals, formatArtists } from '@/shared/utils'
import { API, Track } from '@/shared/api'
import { AudioController, ReplayGainMode } from '@/player/audio'
import { useMainStore } from '@/shared/store'

localStorage.removeItem('player.mute')
localStorage.removeItem('queue')
localStorage.removeItem('queueIndex')

const storedVolume = parseFloat(localStorage.getItem('player.volume') || '1.0')
const storedReplayGainMode = parseInt(localStorage.getItem('player.replayGainMode') ?? '0')
const storedPodcastPlaybackRate = parseFloat(localStorage.getItem('player.podcastPlaybackRate') || '1.0')
const mediaSession: MediaSession | undefined = navigator.mediaSession
const audio = new AudioController()

export const usePlayerStore = defineStore('player', {
  state: () => ({
    queue: null as null | Track[],
    queueIndex: -1,
    isPlaying: false,
    duration: 0, // duration of current track in seconds
    currentTime: 0, // position of current track in seconds
    streamTitle: null as null | string,
    replayGainMode: storedReplayGainMode as ReplayGainMode,
    repeat: localStorage.getItem('player.repeat') !== 'false',
    shuffle: localStorage.getItem('player.shuffle') === 'true',
    volume: storedVolume,
    podcastPlaybackRate: storedPodcastPlaybackRate,
    scrobbled: false,
  }),
  getters: {
    track(): Track | null {
      if (this.queue && this.queueIndex !== -1) {
        return this.queue[this.queueIndex]
      }
      return null
    },
    trackId(): string | null {
      return this.track?.id ?? null
    },
    progress(): number {
      if (this.currentTime > -1 && this.duration > 0) {
        return this.currentTime / this.duration
      }
      return 0
    },
    hasNext(): boolean {
      return !!this.queue && (this.queueIndex < this.queue.length - 1)
    },
    hasPrevious(): boolean {
      return this.queueIndex > 0
    },
    playbackRate(): number {
      return this.track?.isPodcast ? this.podcastPlaybackRate : 1.0
    },
  },
  actions: {
    async playNow(tracks: Track[]) {
      this.setShuffle(false)
      await this.playTrackList(tracks, 0)
    },
    async shuffleNow(tracks: Track[]) {
      this.setShuffle(true)
      await this.playTrackList(tracks)
    },
    async playTrackListIndex(index: number) {
      this.setQueueIndex(index)
      this.setPlaying()
      await audio.changeTrack({ ...this.track, playbackRate: this.playbackRate })
    },
    async playTrackList(tracks: Track[], index?: number) {
      if (index == null) {
        index = this.shuffle ? Math.floor(Math.random() * tracks.length) : 0
      }
      if (this.shuffle) {
        tracks = [...tracks]
        shuffle(tracks, index)
        index = 0
      }
      if (!trackListEquals(this.queue || [], tracks)) {
        this.setQueue(tracks)
      }
      this.setQueueIndex(index)
      this.setPlaying()
      await audio.changeTrack({ ...this.track, playbackRate: this.playbackRate })
    },
    async resume() {
      this.setPlaying()
      await audio.resume()
    },
    async pause() {
      audio.pause()
      this.setPaused()
    },
    async playPause() {
      return this.isPlaying ? this.pause() : this.resume()
    },
    async next() {
      this.setQueueIndex(this.queueIndex + 1)
      this.setPlaying()
      await audio.changeTrack({ ...this.track, playbackRate: this.playbackRate })
    },
    async previous() {
      this.setQueueIndex(audio.currentTime() > 3 ? this.queueIndex : this.queueIndex - 1)
      this.setPlaying()
      await audio.changeTrack(this.track!)
    },
    async seek(value: number) {
      if (isFinite(this.duration)) {
        await audio.seek(this.duration * value)
      }
    },
    async loadQueue() {
      const { tracks, currentTrack, currentTrackPosition } = await this.api.getPlayQueue()
      this.setQueue(tracks)
      this.setQueueIndex(currentTrack)
      this.setPaused()
      await audio.changeTrack({ ...this.track, paused: true, playbackRate: this.playbackRate })
      await audio.seek(currentTrackPosition)
    },
    async resetQueue() {
      this.setQueueIndex(0)
      this.setPaused()
      await audio.changeTrack({ ...this.track, paused: true, playbackRate: this.playbackRate })
    },
    async clearQueue() {
      if (!this.queue) {
        return
      }
      if (this.queue.length > 1) {
        this.setQueue([this.queue[this.queueIndex]])
        this.setQueueIndex(0)
      } else {
        this.setQueue([])
        this.setQueueIndex(-1)
        this.setPaused()
        await audio.changeTrack({ })
      }
    },
    addToQueue(tracks: Track[]) {
      this.queue?.push(...this.shuffle ? shuffled(tracks) : tracks)
    },
    setNextInQueue(tracks: Track[]) {
      this.queue?.splice(this.queueIndex + 1, 0, ...this.shuffle ? shuffled(tracks) : tracks)
    },
    removeFromQueue(index: number) {
      this.queue?.splice(index, 1)
      if (index < this.queueIndex) {
        this.queueIndex--
      }
    },
    shuffleQueue() {
      if (this.queue && this.queue.length > 0) {
        this.queue = shuffled(this.queue, this.queueIndex)
        this.queueIndex = 0
      }
    },
    toggleReplayGain() {
      const mode = (this.replayGainMode + 1) % ReplayGainMode._Length
      audio.setReplayGainMode(mode)
      this.replayGainMode = mode
      localStorage.setItem('player.replayGainMode', `${mode}`)
    },
    toggleRepeat() {
      this.repeat = !this.repeat
      localStorage.setItem('player.repeat', String(this.repeat))
    },
    toggleShuffle() {
      this.setShuffle(!this.shuffle)
    },
    setVolume(value: number) {
      audio.setVolume(value)
      this.volume = value
      localStorage.setItem('player.volume', String(value))
    },
    setPlaybackRate(value: number) {
      this.podcastPlaybackRate = value
      localStorage.setItem('player.podcastPlaybackRate', String(value))
      if (this.track?.isPodcast) {
        audio.setPlaybackRate(value)
      }
    },
    setShuffle(enable: boolean) {
      this.shuffle = enable
      localStorage.setItem('player.shuffle', String(enable))
    },
    setPlaying() {
      this.isPlaying = true
      if (mediaSession) {
        mediaSession.playbackState = 'playing'
      }
    },
    setPaused() {
      this.isPlaying = false
      if (mediaSession) {
        mediaSession.playbackState = 'paused'
      }
    },
    setQueue(queue: Track[]) {
      this.queue = queue
      this.queueIndex = -1
    },
    setQueueIndex(index: number) {
      if (!this.queue || this.queue.length === 0) {
        this.queueIndex = -1
        this.duration = 0
        if (mediaSession) {
          mediaSession.metadata = null
          mediaSession.playbackState = 'none'
        }
        return
      }
      index = Math.max(0, index)
      index = index < this.queue.length ? index : 0
      this.queueIndex = index
      this.scrobbled = false
      const track = this.queue[index]
      this.duration = track.duration
      const next = (index + 1) % this.queue.length
      audio.setBuffer(this.queue[next].url!)
      if (mediaSession) {
        mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: formatArtists(track.artists),
          album: track.album,
          artwork: track.image ? [{ src: track.image, sizes: '300x300' }] : undefined,
        })
      }
    },
  },
})

export function setupAudio(playerStore: ReturnType<typeof usePlayerStore>, mainStore: ReturnType<typeof useMainStore>, api: API) {
  audio.ontimeupdate = (value: number) => {
    playerStore.currentTime = value
  }
  audio.ondurationchange = (value: number) => {
    if (isFinite(value)) {
      playerStore.duration = value
    }
  }
  audio.onended = () => {
    if (playerStore.hasNext || playerStore.repeat) {
      return playerStore.next()
    } else {
      return playerStore.resetQueue()
    }
  }
  audio.onpause = () => {
    playerStore.setPaused()
  }
  audio.onstreamtitlechange = (value: string | null) => {
    playerStore.streamTitle = value
    if (value && mediaSession?.metadata) {
      mediaSession.metadata.title = value
    }
  }
  audio.onerror = (error: any) => {
    playerStore.setPaused()
    mainStore.setError(error)
  }

  audio.setReplayGainMode(storedReplayGainMode)
  audio.setVolume(storedVolume)

  const track = playerStore.track
  if (track?.url) {
    audio.changeTrack({ ...track, paused: true })
  }
  audio.setPlaybackRate(playerStore.playbackRate)

  if (mediaSession) {
    mediaSession.setActionHandler('play', () => {
      playerStore.resume()
    })
    mediaSession.setActionHandler('pause', () => {
      playerStore.pause()
    })
    mediaSession.setActionHandler('nexttrack', () => {
      playerStore.next()
    })
    mediaSession.setActionHandler('previoustrack', () => {
      playerStore.previous()
    })
    mediaSession.setActionHandler('stop', () => {
      playerStore.pause()
    })
    mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime) {
        audio.seek(details.seekTime)
      }
    })
    mediaSession.setActionHandler('seekforward', (details) => {
      const offset = details.seekOffset || 10
      audio.seek(Math.min(audio.currentTime() + offset, audio.duration()))
    })
    mediaSession.setActionHandler('seekbackward', (details) => {
      const offset = details.seekOffset || 10
      audio.seek(Math.max(audio.currentTime() - offset, 0))
    })
    // FIXME
    // function updatePositionState() {
    //   if (mediaSession && mediaSession.setPositionState) {
    //     mediaSession.setPositionState({
    //       duration: audio.duration || 0,
    //       playbackRate: audio.playbackRate,
    //       position: audio.currentTime,
    //     });
    //   }
    // }

    // Update now playing
    watch(
      () => playerStore.trackId,
      () => {
        const track = playerStore.track
        if (track && !track.isStream) {
          return api.updateNowPlaying(track.id)
        }
      })

    // Scrobble
    watch(
      () => playerStore.currentTime,
      () => {
        if (
          playerStore.track &&
          playerStore.scrobbled === false &&
          playerStore.duration > 30 &&
          playerStore.currentTime / playerStore.duration > 0.7
        ) {
          const { id, isStream } = playerStore.track
          if (!isStream) {
            playerStore.scrobbled = true
            return api.scrobble(id)
          }
        }
      })

    // Save play queue
    const maxDuration = 10_000
    const lastSaved = ref(Date.now())

    watch(
      () => [
        playerStore.queue,
        playerStore.queueIndex,
      ],
      (_: any, [oldQueue]) => {
        if (oldQueue !== null) {
          lastSaved.value = Date.now()
          return api.savePlayQueue(playerStore.queue!, playerStore.track, playerStore.currentTime)
        }
      })

    watch(
      () => [playerStore.currentTime],
      () => {
        const now = Date.now()
        const duration = now - lastSaved.value
        if (duration >= maxDuration) {
          lastSaved.value = now
          return api.savePlayQueue(playerStore.queue!, playerStore.track, playerStore.currentTime)
        }
      })
  }
}
