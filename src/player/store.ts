import Vuex, { Store, Module } from 'vuex'
import { shuffle, shuffled, trackListEquals } from '@/shared/utils'
import { API } from '@/shared/api'
import { AudioController } from '@/player/audio'
import { useMainStore } from '@/shared/store'

localStorage.removeItem('player.mute')
const storedQueue = JSON.parse(localStorage.getItem('queue') || '[]')
const storedQueueIndex = parseInt(localStorage.getItem('queueIndex') || '-1')
const storedVolume = parseFloat(localStorage.getItem('player.volume') || '1.0')
const storedPodcastPlaybackRate = parseFloat(localStorage.getItem('player.podcastPlaybackRate') || '1.0')
const mediaSession: MediaSession | undefined = navigator.mediaSession
const audio = new AudioController()

interface State {
  queue: any[];
  queueIndex: number;
  scrobbled: boolean;
  isPlaying: boolean;
  duration: number; // duration of current track in seconds
  currentTime: number; // position of current track in seconds
  streamTitle: string | null;
  repeat: boolean;
  shuffle: boolean;
  volume: number; // integer between 0 and 1 representing the volume of the player
  podcastPlaybackRate: number;
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
    streamTitle: null,
    repeat: localStorage.getItem('player.repeat') !== 'false',
    shuffle: localStorage.getItem('player.shuffle') === 'true',
    volume: storedVolume,
    podcastPlaybackRate: storedPodcastPlaybackRate,
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
    shuffleQueue(state) {
      if (state.queue.length > 0) {
        state.queue = shuffled(state.queue, state.queueIndex)
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
    setStreamTitle(state, value: string | null) {
      state.streamTitle = value
      if (value && mediaSession?.metadata) {
        mediaSession.metadata.title = value
      }
    },
    setScrobbled(state) {
      state.scrobbled = true
    },
    setVolume(state, value: number) {
      state.volume = value
      localStorage.setItem('player.volume', String(value))
    },
    setPodcastPlaybackRate(state, value) {
      state.podcastPlaybackRate = value
      localStorage.setItem('player.podcastPlaybackRate', String(value))
    }
  },

  actions: {
    async playNow({ commit, dispatch }, { tracks }) {
      commit('setShuffle', false)
      dispatch('playTrackList', { tracks, index: 0 })
    },
    async shuffleNow({ commit, dispatch }, { tracks }) {
      commit('setShuffle', true)
      dispatch('playTrackList', { tracks })
    },
    async playTrackListIndex({ commit, getters }, { index }) {
      commit('setQueueIndex', index)
      commit('setPlaying')
      await audio.changeTrack({ ...getters.track, playbackRate: getters.playbackRate })
    },
    async playTrackList({ commit, state, getters }, { tracks, index }) {
      if (index == null) {
        index = state.shuffle ? Math.floor(Math.random() * tracks.length) : 0
      }
      if (state.shuffle) {
        tracks = [...tracks]
        shuffle(tracks, index)
        index = 0
      }
      if (!trackListEquals(state.queue, tracks)) {
        commit('setQueue', tracks)
      }
      commit('setQueueIndex', index)
      commit('setPlaying')
      await audio.changeTrack({ ...getters.track, playbackRate: getters.playbackRate })
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
      await audio.changeTrack({ ...getters.track, playbackRate: getters.playbackRate })
    },
    async previous({ commit, state, getters }) {
      commit('setQueueIndex', audio.currentTime() > 3 ? state.queueIndex : state.queueIndex - 1)
      commit('setPlaying')
      await audio.changeTrack(getters.track)
    },
    seek({ state }, value) {
      if (isFinite(state.duration)) {
        audio.seek(state.duration * value)
      }
    },
    async resetQueue({ commit, getters }) {
      commit('setQueueIndex', 0)
      commit('setPaused')
      await audio.changeTrack({ ...getters.track, paused: true, playbackRate: getters.playbackRate })
    },
    toggleRepeat({ commit, state }) {
      commit('setRepeat', !state.repeat)
    },
    toggleShuffle({ commit, state }) {
      commit('setShuffle', !state.shuffle)
    },
    setShuffle({ commit }, enable: boolean) {
      commit('setShuffle', enable)
    },
    addToQueue({ state, commit }, tracks) {
      commit('addToQueue', state.shuffle ? shuffled(tracks) : tracks)
    },
    setNextInQueue({ state, commit }, tracks) {
      commit('setNextInQueue', state.shuffle ? shuffled(tracks) : tracks)
    },
    setVolume({ commit }, value) {
      audio.setVolume(value)
      commit('setVolume', value)
    },
    setPlaybackRate({ commit, getters }, value) {
      commit('setPodcastPlaybackRate', value)
      if (getters.track?.isPodcast) {
        audio.setPlaybackRate(value)
      }
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
    progress(state): number {
      if (state.currentTime > -1 && state.duration > 0) {
        return state.currentTime / state.duration
      }
      return 0
    },
    hasNext(state) {
      return state.queueIndex < state.queue.length - 1
    },
    hasPrevious(state) {
      return state.queueIndex > 0
    },
    playbackRate(state, getters): number {
      return getters.track?.isPodcast ? state.podcastPlaybackRate : 1.0
    },
  },
}

export function createPlayerStore(mainStore: ReturnType<typeof useMainStore>, api: API) {
  const store = new Vuex.Store({
    strict: true,
    modules: {
      player: {
        namespaced: true,
        ...playerModule
      },
    }
  })
  setupAudio(store, mainStore, api)
  return store
}

function setupAudio(store: Store<any>, mainStore: ReturnType<typeof useMainStore>, api: API) {
  audio.ontimeupdate = (value: number) => {
    store.commit('player/setCurrentTime', value)
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
  audio.onpause = () => {
    store.commit('player/setPaused')
  }
  audio.onstreamtitlechange = (value: string | null) => {
    store.commit('player/setStreamTitle', value)
  }
  audio.onerror = (error: any) => {
    store.commit('player/setPaused')
    mainStore.setError(error)
  }

  audio.setVolume(storedVolume)
  const track = store.getters['player/track']
  if (track?.url) {
    audio.changeTrack({ ...track, paused: true })
  }
  audio.setPlaybackRate(store.getters['player/playbackRate'])

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

    // Update now playing
    store.watch(
      (state, getters) => getters['player/trackId'],
      () => {
        const { id, isStream } = store.getters['player/track']
        if (!isStream) {
          return api.updateNowPlaying(id)
        }
      })

    // Scrobble
    store.watch(
      (state) => state.player.currentTime,
      () => {
        if (
          store.state.player.scrobbled === false &&
          store.state.player.duration > 30 &&
          store.state.player.currentTime / store.state.player.duration > 0.7
        ) {
          const { id, isStream } = store.getters['player/track']
          if (!isStream) {
            store.commit('player/setScrobbled')
            return api.scrobble(id)
          }
        }
      })
  }
}
