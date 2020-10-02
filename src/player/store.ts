import { Store, Module } from 'vuex'

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
  isPlaying: boolean;
  duration: number; // duration of current track in seconds
  currentTime: number; // position of current track in seconds
}

export const playerModule: Module<State, any> = {
  namespaced: true,
  state: {
    queue: storedQueue,
    queueIndex: storedQueueIndex,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
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
    setPosition(state, time: number) {
      audio.currentTime = time
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
      const track = state.queue[index]
      audio.src = track.url
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
    setProgress(state, value: any) {
      state.currentTime = value
    },
    setDuration(state, value: any) {
      state.duration = value
    },
  },

  actions: {
    async playTrackList({ commit }, { queue, index }) {
      commit('setQueue', [...queue])
      commit('setQueueIndex', index)
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
    async next({ commit, state }) {
      commit('setQueueIndex', state.queueIndex + 1)
      commit('setPlaying')
      await audio.play()
    },
    async previous({ commit, state }) {
      commit('setQueueIndex', state.queueIndex - 1)
      commit('setPlaying')
      await audio.play()
    },
    seek({ commit, state }, value) {
      if (isFinite(state.duration)) {
        commit('setPosition', state.duration * value)
      }
    },
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

export function setupAudio(store: Store<any>) {
  audio.ontimeupdate = () => {
    store.commit('player/setProgress', audio.currentTime)
  }
  audio.ondurationchange = () => {
    store.commit('player/setDuration', audio.duration)
  }
  audio.onended = () => {
    store.dispatch('player/next')
  }
  audio.onerror = () => {
    store.commit('player/setPaused')
    store.commit('setError', audio.error)
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
      store.commit('player/setPosition', details.seekTime)
    })
    mediaSession.setActionHandler('seekforward', (details) => {
      const offset = details.seekOffset || 10
      store.commit('player/setPosition', Math.min(audio.currentTime + offset, audio.duration))
    })
    mediaSession.setActionHandler('seekbackward', (details) => {
      const offset = details.seekOffset || 10
      store.commit('player/setPosition', Math.max(audio.currentTime - offset, 0))
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
