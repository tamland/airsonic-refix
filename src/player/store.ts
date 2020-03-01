import { Store, Module } from 'vuex'


interface State {
  queue: any[];
  queueIndex: number;
  isPlaying: boolean;
  duration: number; // duration of current track in seconds
  currentTime: number; // position of current track in seconds
}

const audio = new Audio();
const storedQueue = JSON.parse(localStorage.getItem("queue") || "[]");
const storedQueueIndex = parseInt(localStorage.getItem("queueIndex") || "-1");
if (storedQueueIndex > -1 && storedQueueIndex < storedQueue.length) {
  audio.src = storedQueue[storedQueueIndex].url;
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
    playPause(state: State) {
      if (state.isPlaying) {
        state.isPlaying = false;
        audio.pause();
      } else {
        state.isPlaying = true;
        audio.play();
      }
    },
    seek(state, value: number) {
      console.log("seek: " + value);
      if (state.queueIndex != -1) {
        const seconds = state.duration * value;
        audio.currentTime = seconds;
      }
    },
    setQueueAndPlay(state, { queue, index }) {
      state.queue = queue;
      state.queueIndex = index;
      localStorage.setItem("queue", JSON.stringify(queue));
      localStorage.setItem("queueIndex", index);
      state.isPlaying = true;
      audio.src = queue[index].url;
      audio.play();
    },
    playQueueIndex(state, index) {
      if (state.queue.length === 0) {
        return;
      }
      index = index < state.queue.length ? index : 0;
      state.isPlaying = true;
      state.queueIndex = index;
      audio.src = state.queue[index].url;
      audio.play();
    },
    removeFromQueue(state, index) {
      state.queue.splice(index, 1);
      if (index < state.queueIndex) {
        state.queueIndex--;
      }
    },
    setProgress(state: State, value: any) {
      state.currentTime = value;
    },
    setDuration(state: State, value: any) {
      state.duration = value;
    },
  },

  actions: {
    play({ commit }, { queue, index }) {
      commit('setQueueAndPlay', { index, queue });
    },
    playNext({ commit, state }) {
      commit("playQueueIndex", state.queueIndex + 1);
    },
    playPrevious({ commit, state }) {
      commit("playQueueIndex", state.queueIndex - 1);
    },
  },
  
  getters: {
    track(state) {
      if (state.queueIndex != -1) {
        return state.queue[state.queueIndex];
      }
      return null;
    },
    trackId(state, getters): number {
      return getters.track ? getters.track.id : -1;
    },
    progress(state) {
      if (state.currentTime > -1 && state.duration > 0) {
        return (state.currentTime / state.duration) * 100;
      }
      return 0;
    },
    hasNext(state) {
      return state.queueIndex < state.queue.length - 1;
    },
    hasPrevious(state) {
      return state.queueIndex > 0;
    },
  },
};


export function connectAudioToStore(store: Store<any>) {
  audio.ontimeupdate = (event) => {
    store.commit("player/setProgress", audio.currentTime)
  };
  audio.ondurationchange = (event) => {
    store.commit("player/setDuration", audio.duration);
  }
  audio.onended = (event) => {
    store.dispatch("player/playNext");
  }
}
