import { Store, Module } from 'vuex'
import { shuffle, trackListEquals } from '@/shared/utils'
import { API } from '@/shared/api'

const audio = new Audio()
const storedQueue = JSON.parse(localStorage.getItem('queue') || '[]')
const storedQueueIndex = parseInt(localStorage.getItem('queueIndex') || '-1')
if (storedQueueIndex > -1 && storedQueueIndex < storedQueue.length) {
  audio.src = storedQueue[storedQueueIndex].url
}
const mediaSession: MediaSession | undefined = navigator.mediaSession

interface State {
  queue: any[];
  queueIndex: number;
  scrobbled: boolean;
  isPlaying: boolean;
  duration: number; // duration of current track in seconds
  currentTime: number; // position of current track in seconds
  repeat: boolean;
  shuffle: boolean;
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
      localStorage.setItem('queue', JSON.stringify(queue))
    },
    setQueueIndex(state, index) {
      if (state.queue.length === 0) {
        return
      }
      index = Math.max(0, index)
      index = index < state.queue.length ? index : 0
      state.queueIndex = index
      localStorage.setItem('queueIndex', index)
      state.scrobbled = false
      const track = state.queue[index]
      audio.src = track.url
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
    addToQueue(state, track) {
      state.queue.push(track)
    },
    removeFromQueue(state, index) {
      state.queue.splice(index, 1)
      if (index < state.queueIndex) {
        state.queueIndex--
      }
    },
    setNextInQueue(state, track) {
      state.queue.splice(state.queueIndex + 1, 0, track)
    },
    setCurrentTime(state, value: any) {
      state.currentTime = value
    },
    setDuration(state, value: any) {
      state.duration = value
    },
    setScrobbled(state) {
      state.scrobbled = true
    },
  },

  actions: {
    async playTrackList({ commit, state }, { tracks, index }) {
      if (trackListEquals(state.queue, tracks)) {
        commit('setQueueIndex', index)
        commit('setPlaying')
        await audio.play()
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
      await audio.play()
    },
    async resume({ commit }) {
      commit('setPlaying')
      await audio.play()
    },
    async pause({ commit }) {
      audio.pause()
      commit('setPaused')
    },
    async playPause({ state, dispatch }) {
      if (state.isPlaying) {
        return dispatch('pause')
      }
      return dispatch('resume')
    },
    async next({ commit, state, getters, dispatch }) {
      if (!state.repeat && !getters.hasNext) {
        return dispatch('resetQueue')
      }
      commit('setQueueIndex', state.queueIndex + 1)
      commit('setPlaying')
      await audio.play()
    },
    async previous({ commit, state }) {
      commit('setQueueIndex', state.queueIndex - 1)
      commit('setPlaying')
      await audio.play()
    },
    seek({ state }, value) {
      if (isFinite(state.duration)) {
        audio.currentTime = state.duration * value
      }
    },
    resetQueue({ commit }) {
      audio.pause()
      commit('setQueueIndex', 0)
      commit('setPaused')
    },
    toggleRepeat({ commit, state }) {
      commit('setRepeat', !state.repeat)
    },
    toggleShuffle({ commit, state }) {
      commit('setShuffle', !state.shuffle)
    },
    addToQueue({ commit }, track) {
      commit('addToQueue', track)
    },
    setNextInQueue({ commit }, track) {
      commit('setNextInQueue', track)
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
  audio.ontimeupdate = () => {
    store.commit('player/setCurrentTime', audio.currentTime)

    // Scrobble
    if (store.state.player.scrobbled === false &&
        audio.duration > 30 &&
        audio.currentTime / audio.duration > 0.7) {
      const id = store.getters['player/trackId']
      store.commit('player/setScrobbled')
      api.scrobble(id)
    }
  }
  audio.ondurationchange = () => {
    store.commit('player/setDuration', audio.duration)
  }
  audio.onerror = () => {
    store.commit('player/setPaused')
    store.commit('setError', audio.error)
  }
  audio.onended = () => {
    store.dispatch('player/next')
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
        audio.currentTime = details.seekTime
      }
    })
    mediaSession.setActionHandler('seekforward', (details) => {
      const offset = details.seekOffset || 10
      audio.currentTime = Math.min(audio.currentTime + offset, audio.duration)
    })
    mediaSession.setActionHandler('seekbackward', (details) => {
      const offset = details.seekOffset || 10
      audio.currentTime = Math.max(audio.currentTime - offset, 0)
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
