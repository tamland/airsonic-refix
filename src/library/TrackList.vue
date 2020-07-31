<template>
  <div>
    <b-table-simple borderless hover>
    <thead>
      <tr>
        <th class="pl-0 pr-0 text-center text-muted"></th>
        <th class="text-left">Title</th>
        <th class="text-left">Artist</th>
        <th v-if="showAlbum" class="text-left">Album</th>
        <th class="text-right">Duration</th>
        <th class="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in tracks" :key="item.id"
           draggable="true" @dragstart="dragstart(item.id, $event)"
          :class="{'text-primary': item.id === playingTrackId}">
        <td class="pl-0 pr-0 text-center text-muted" style="min-width: 20px; max-width: 20px;">
          <span class="track-status">
            <template v-if="item.id === playingTrackId">
              <Icon :icon="isPlaying ? 'pause-fill' : 'play-fill'" class="text-primary"/>
            </template>
            <template v-else>{{ item.track || 1 }}</template>
          </span>
          <span class="track-status-hover">
            <span v-if="item.id === playingTrackId" @click="playPause()">
              <Icon :icon="isPlaying ? 'pause-fill' : 'play-fill'" class="text-primary"/>
            </span>
            <span v-else @click="play(index)">
              <Icon icon="play-fill"/>
            </span>
          </span>
        </td>
        <td>{{ item.title }}</td>
        <td>
          <template v-if="item.artistId">
            <router-link :to="{name: 'artist', params: {id: item.artistId}}">
              {{ item.artist }}
            </router-link>
          </template>
          <template v-else>
            {{ item.artist }}
          </template>
        </td>
        <td v-if="showAlbum">
          <router-link :to="{name: 'album', params: {id: item.albumId}}">
            {{ item.album }}
          </router-link>
        </td>
        <td class="text-right">
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
  .track-status-hover {
    display: none;
  }
  tr:hover {
    .track-status-hover {
      display: inline;
    }
    .track-status {
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
