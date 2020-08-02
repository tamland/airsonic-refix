<template>
  <div>
    <b-table-simple borderless hover>
    <thead>
      <tr>
        <th class="pl-0 pr-0 text-center text-muted"></th>
        <th class="text-left">Title</th>
        <th class="text-left d-none d-lg-table-cell">Artist</th>
        <th class="text-left d-none d-md-table-cell" v-if="showAlbum">Album</th>
        <th class="text-right d-none d-md-table-cell">Duration</th>
        <th class="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in tracks" :key="item.id"
           draggable="true" @dragstart="dragstart(item.id, $event)"
          :class="{'text-primary': item.id === playingTrackId}">
        <td class="pl-0 pr-0 text-center text-muted"
            style="min-width: 20px; max-width: 20px;"
            @click="play(index)">
          <template v-if="item.id === playingTrackId">
            <Icon :icon="isPlaying ? 'pause-fill' : 'play-fill'" class="text-primary"/>
          </template>
          <template v-else>
            <span class="track-number">{{ item.track || 1 }}</span>
            <Icon class="track-number-hover" icon="play-fill"/>
          </template>
        </td>
        <td @click="play(index)">
          {{ item.title }}
          <div class="d-lg-none text-muted">
            <small>{{ item.artist }}</small>
          </div>
        </td>
        <td class="d-none d-lg-table-cell">
          <template v-if="item.artistId">
            <router-link :to="{name: 'artist', params: {id: item.artistId}}">
              {{ item.artist }}
            </router-link>
          </template>
          <template v-else>
            {{ item.artist }}
          </template>
        </td>
        <td class="d-none d-md-table-cell" v-if="showAlbum">
          <router-link :to="{name: 'album', params: {id: item.albumId}}">
            {{ item.album }}
          </router-link>
        </td>
        <td class="text-right d-none d-md-table-cell">
          {{ item.duration | duration }}
        </td>
        <td class="text-right">
          <TrackContextMenu :track="item">
            <template v-slot="{ item }">
              <slot name="context-menu" :index="index" :item="item"></slot>
            </template>
          </TrackContextMenu>
        </td>
      </tr>
    </tbody>
  </b-table-simple>
  </div>
</template>
<style lang="scss" scoped>
  .track-number-hover {
    display: none;
  }
  tr:hover {
    .track-number-hover {
      display: inline;
    }
    .track-number {
      display: none;
    }
  }
</style>
<script lang="ts">
import Vue from "vue";
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex';
import TrackContextMenu from "@/library/TrackContextMenu.vue"

export default Vue.extend({
  components: {
    TrackContextMenu,
  },
  props: {
    tracks: { type: Array, required: true },
    showAlbum: { type: Boolean, default: false },
  },
  computed: {
    ...mapState("player", {
      isPlaying: "isPlaying",
    }),
    ...mapGetters({
      playingTrackId: "player/trackId",
    }),
  },
  methods: {
    ...mapMutations({
      playPause: "player/playPause",
    }),
    play(index: number) {
      if ((this.tracks as any)[index].id === this.playingTrackId) {
        this.$store.commit("player/playPause")
        return;
      }
      this.$store.dispatch('player/play', {
        index,
        queue: this.tracks,
      })
    },
    dragstart(id: string, event: any)  {
      console.log("dragstart: " + id)
      event.dataTransfer.setData("id", id);
    },
  }
});
</script>
