import { Store, Module } from 'vuex'
import { shuffle, trackListEquals } from '@/shared/utils'
import { API } from '@/shared/api'
import { AudioController } from '@/player/audio'

const storedQueue = JSON.parse(localStorage.getItem('queue') || '[]')
const storedQueueIndex = parseInt(localStorage.getItem('queueIndex') || '-1')
const storedVolume = parseFloat(localStorage.getItem('player.volume') || '1.0')
const storedMuteState = localStorage.getItem('player.mute') === 'true'
const mediaSession: MediaSession | undefined = navigator.mediaSession
const audio = new AudioController()

interface State {
  queue: any[];
  queueIndex: number;
  scrobbled: boolean;
  isPlaying: boolean;
  duration: number; // duration of current track in seconds
  currentTime: number; // position of current track in seconds
  repeat: boolean;
  shuffle: boolean;
  mute: boolean;
  volume: number; // integer between 0 and 1 representing the volume of the player
}

function persistQueue(state: State) {
  localStorage.setItem('queue', JSON.stringify(state.queue))
  localStorage.setItem('queueIndex', state.queueIndex.toString())
}

export const playerModule: Module<State, any> = {
  namespaced: true,
  state: {
    queue: storedQueue,
    queueIndex: storedQueueIndex,
    scrobbled: false,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    repeat: localStorage.getItem('player.repeat') !== 'false',
    shuffle: localStorage.getItem('player.shuffle') === 'true',
    mute: storedMuteState,
    volume: storedVolume,
  },

  mutations: {
    setPlaying(state) {
      state.isPlaying = true
      if (mediaSession) {
        mediaSession.playbackState = 'playing'
      }
    },
    setPaused(state) {
      state.isPlaying = false
      if (mediaSession) {
        mediaSession.playbackState = 'paused'
      }
    },
    setRepeat(state, enable) {
      state.repeat = enable
      localStorage.setItem('player.repeat', enable)
    },
    setShuffle(state, enable) {
      state.shuffle = enable
      localStorage.setItem('player.shuffle', enable)
    },
    setMute(state, enable) {
      state.mute = enable
      localStorage.setItem('player.mute', enable)
    },
    setQueue(state, queue) {
      state.queue = queue
      state.queueIndex = -1
      persistQueue(state)
    },
    setQueueIndex(state, index) {
      if (state.queue.length === 0) {
        return
      }
      index = Math.max(0, index)
      index = index < state.queue.length ? index : 0
      state.queueIndex = index
      persistQueue(state)
      state.scrobbled = false
      const track = state.queue[index]
      state.duration = track.duration
      const next = (index + 1) % state.queue.length
      audio.setBuffer(state.queue[next].url)
      document.title = `${track.title} • ${track.artist}`
      if (mediaSession) {
        mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: track.album,
          artwork: track.image ? [{ src: track.image, sizes: '300x300' }] : undefined,
        })
      }
    },
    addToQueue(state, tracks) {
      state.queue.push(...tracks)
      persistQueue(state)
    },
    removeFromQueue(state, index) {
      state.queue.splice(index, 1)
      if (index < state.queueIndex) {
        state.queueIndex--
      }
      persistQueue(state)
    },
    clearQueue(state) {
      if (state.queueIndex >= 0) {
        state.queue = [state.queue[state.queueIndex]]
        state.queueIndex = 0
        persistQueue(state)
      }
    },
    setNextInQueue(state, tracks) {
      state.queue.splice(state.queueIndex + 1, 0, ...tracks)
      persistQueue(state)
    },
    setCurrentTime(state, value: any) {
      state.currentTime = value
    },
    setDuration(state, value: any) {
      if (isFinite(value)) {
        state.duration = value
      }
    },
    setScrobbled(state) {
      state.scrobbled = true
    },
    setVolume(state, value: number) {
      state.volume = value
      state.mute = value <= 0.0
      localStorage.setItem('player.volume', String(value))
    },
  },

  actions: {
    async playTrackList({ commit, state, getters }, { tracks, index }) {
      if (trackListEquals(state.queue, tracks)) {
        commit('setQueueIndex', index)
        commit('setPlaying')
        await audio.changeTrack(getters.track.url)
        return
      }
      tracks = [...tracks]
      if (state.shuffle) {
        const selected = tracks[index]
        tracks.splice(index, 1)
        tracks = [selected, ...shuffle(tracks)]
        commit('setQueue', tracks)
        commit('setQueueIndex', 0)
      } else {
        commit('setQueue', tracks)
        commit('setQueueIndex', index)
      }
      commit('setPlaying')
      await audio.changeTrack(getters.track.url)
    },
    async resume({ commit }) {
      commit('setPlaying')
      await audio.resume()
    },
    async pause({ commit }) {
      audio.pause()
      commit('setPaused')
    },
    async playPause({ state, dispatch }) {
      return state.isPlaying ? dispatch('pause') : dispatch('resume')
    },
    async next({ commit, state, getters }) {
      commit('setQueueIndex', state.queueIndex + 1)
      commit('setPlaying')
      await audio.changeTrack(getters.track.url)
    },
    async previous({ commit, state, getters }) {
      commit('setQueueIndex', audio.currentTime() > 3 ? state.queueIndex : state.queueIndex - 1)
      commit('setPlaying')
      await audio.changeTrack(getters.track.url)
    },
    seek({ state }, value) {
      if (isFinite(state.duration)) {
        audio.seek(state.duration * value)
      }
    },
    async resetQueue({ commit, getters }) {
      commit('setQueueIndex', 0)
      commit('setPaused')
      await audio.changeTrack(getters.track.url, { paused: true })
    },
    toggleRepeat({ commit, state }) {
      commit('setRepeat', !state.repeat)
    },
    toggleShuffle({ commit, state }) {
      commit('setShuffle', !state.shuffle)
    },
    toggleMute({ commit, state }) {
      commit('setMute', !state.mute)
      audio.setVolume(state.mute ? 0.0 : state.volume)
    },
    addToQueue({ state, commit }, tracks) {
      commit('addToQueue', state.shuffle ? shuffle([...tracks]) : tracks)
    },
    setNextInQueue({ state, commit }, tracks) {
      commit('setNextInQueue', state.shuffle ? shuffle([...tracks]) : tracks)
    },
    setVolume({ commit }, value) {
      audio.setVolume(value)
      commit('setVolume', value)
    },
  },

  getters: {
    track(state) {
      if (state.queueIndex !== -1) {
        return state.queue[state.queueIndex]
      }
      return null
    },
    trackId(state, getters): number {
      return getters.track ? getters.track.id : -1
    },
    isPlaying(state): boolean {
      return state.isPlaying
    },
    progress(state) {
      if (state.currentTime > -1 && state.duration > 0) {
        return (state.currentTime / state.duration) * 100
      }
      return 0
    },
    hasNext(state) {
      return state.queueIndex < state.queue.length - 1
    },
    hasPrevious(state) {
      return state.queueIndex > 0
    },
  },
}

export function setupAudio(store: Store<any>, api: API) {
  audio.ontimeupdate = (value: number) => {
    store.commit('player/setCurrentTime', value)
    // Scrobble
    if (
      store.state.player.scrobbled === false &&
      store.state.player.duration > 30 &&
      audio.currentTime() / store.state.player.duration > 0.7
    ) {
      const id = store.getters['player/trackId']
      store.commit('player/setScrobbled')
      api.scrobble(id)
    }
  }
  audio.ondurationchange = (value: number) => {
    store.commit('player/setDuration', value)
  }
  audio.onended = () => {
    if (store.getters['player/hasNext'] || store.state.player.repeat) {
      return store.dispatch('player/next')
    } else {
      return store.dispatch('player/resetQueue')
    }
  }
  audio.onerror = (error: any) => {
    store.commit('player/setPaused')
    store.commit('setError', error)
  }

  audio.setVolume(storedMuteState ? 0.0 : storedVolume)
  const url = store.getters['player/track']?.url
  if (url) {
    audio.changeTrack(url, { paused: true })
  }

  if (mediaSession) {
    mediaSession.setActionHandler('play', () => {
      store.dispatch('player/resume')
    })
    mediaSession.setActionHandler('pause', () => {
      store.dispatch('player/pause')
    })
    mediaSession.setActionHandler('nexttrack', () => {
      store.dispatch('player/next')
    })
    mediaSession.setActionHandler('previoustrack', () => {
      store.dispatch('player/previous')
    })
    mediaSession.setActionHandler('stop', () => {
      store.dispatch('player/pause')
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
  }
}
