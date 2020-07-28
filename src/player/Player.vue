<template>
  <div class="d-flex player">
    <div v-if="track" class="d-none d-sm-block">
      <b-img :src="track.image" block width="80px" height="80px"></b-img>
    </div>
    <div class="flex-fill">
      <!-- Progress --->
      <div class="progress2" @click="seek">
        <b-progress :value="progress" :max="100" height="4px"></b-progress>
      </div>
      <div class="row d-flex align-items-center p-2 m-0">
        <!-- Track info --->
        <div class="col d-flex p-0 text-truncate">
          <div class="d-flex align-items-center">
            <template v-if="track">
              <div class="ml-2 align-middle">
                <div>{{ track.title }}</div>
                <div>{{ track.artist }}</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Controls--->
        <div class="col-auto p-0">
          <b-button variant="link" class="m-2"
              :disabled="!hasPrevious" @click="playPrevious">
            <Icon icon="skip-start-fill"/>
          </b-button>
          <b-button variant="link" size="lg" class="m-2" @click="playPause">
            <Icon :icon="isPlaying ? 'pause-fill' : 'play-fill'"/>
          </b-button>
          <b-button variant="link" class="m-2"
              :disabled="!hasNext" @click="playNext">
            <Icon icon="skip-end-fill"/>
          </b-button>
        </div>
        <div class="col p-0 text-truncate">
          <div v-if="track" class="text-right">
            <span>{{ currentTime | duration }} / {{ duration | duration }}</span>
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
</style>
<script lang="ts">
import Vue from "vue";
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState("player", {
      isPlaying: (state: any) => state.isPlaying,
      currentTime: (state: any) => state.currentTime,
      duration: (state: any) => state.duration,
    }),
    ...mapGetters("player", [
      "track",
      "progress",
      "hasNext",
      "hasPrevious",
    ]),
  },
  methods: {
    ...mapMutations("player", [
      "playPause",
    ]),
    ...mapActions("player", [
      "playNext",
      "playPrevious",
    ]),
    seek(event: any) {
      if (event.target) {
        const width = event.target.clientWidth;
        const value = event.offsetX / width
        this.$store.commit("player/seek", value)
      // this.internalValue = e.offsetX / width * 100

      }
    }
  }
});
</script>
