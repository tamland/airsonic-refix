<template>
  <div class="d-flex player">
    <div v-if="track" class="d-none d-sm-block">
      <router-link :to="{name: 'album', params: {id: track.albumId}}">
        <b-img :src="track.image" block width="80px" height="80px" />
      </router-link>
    </div>
    <div class="flex-fill">
      <!-- Progress --->
      <div class="progress2" @click="seek">
        <b-progress :value="progress" :max="100" height="4px" />
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
          <b-button variant="link" class="m-2" @click="previous">
            <Icon icon="skip-start-fill" />
          </b-button>
          <b-button variant="link" size="lg" class="m-2" @click="playPause">
            <Icon :icon="isPlaying ? 'pause-fill' : 'play-fill'" />
          </b-button>
          <b-button variant="link" class="m-2" @click="next">
            <Icon icon="skip-end-fill" />
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
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default Vue.extend({
    data() {
      return {

      }
    },
    computed: {
      ...mapState('player', {
        isPlaying: (state: any) => state.isPlaying,
        currentTime: (state: any) => state.currentTime,
        duration: (state: any) => state.duration,
      }),
      ...mapGetters('player', [
        'track',
        'progress',
      ]),
    },
    methods: {
      ...mapActions('player', [
        'playPause',
        'next',
        'previous',
      ]),
      seek(event: any) {
        if (event.target) {
          const width = event.currentTarget.clientWidth
          const value = event.offsetX / width
          return this.$store.dispatch('player/seek', value)
        }
      }
    }
  })
</script>
