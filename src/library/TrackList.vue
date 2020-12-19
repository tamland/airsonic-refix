<template>
  <div>
    <table class="table table-hover table-borderless">
      <thead>
        <tr>
          <th class="pl-0 pr-0 text-center">
            #
          </th>
          <th class="text-left">
            Title
          </th>
          <th v-if="!noArtist" class="text-left d-none d-lg-table-cell">
            Artist
          </th>
          <th v-if="!noAlbum" class="text-left d-none d-md-table-cell">
            Album
          </th>
          <th v-if="!noDuration" class="text-right d-none d-md-table-cell">
            Duration
          </th>
          <th class="text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in tracks"
          :key="index"
          :class="{'active': item.id === playingTrackId}"
          :draggable="true"
          @dragstart="dragstart(item.id, $event)"
          @click="play(index)"
        >
          <td class="pl-0 pr-0 text-center text-muted"
              style="min-width: 20px; max-width: 20px;"
          >
            <template v-if="item.id === playingTrackId">
              <Icon :icon="isPlaying ? 'pause-fill' : 'play-fill'" />
            </template>
            <template v-else>
              <span class="track-number">{{ item.track || 1 }}</span>
              <Icon class="track-number-hover" icon="play-fill" />
            </template>
          </td>
          <td>
            {{ item.title }}
            <div class="d-lg-none text-muted">
              <small>{{ item.artist }}</small>
            </div>
          </td>
          <td v-if="!noArtist" class="d-none d-lg-table-cell">
            <template v-if="item.artistId">
              <router-link :to="{name: 'artist', params: {id: item.artistId}}" @click.native.stop>
                {{ item.artist }}
              </router-link>
            </template>
            <template v-else>
              {{ item.artist }}
            </template>
          </td>
          <td v-if="!noAlbum" class="d-none d-md-table-cell">
            <router-link :to="{name: 'album', params: {id: item.albumId}}" @click.native.stop>
              {{ item.album }}
            </router-link>
          </td>
          <td v-if="!noDuration" class="text-right d-none d-md-table-cell">
            {{ $formatDuration(item.duration) }}
          </td>
          <td class="text-right">
            <TrackContextMenu :track="item">
              <slot name="context-menu" :index="index" :item="item" />
            </TrackContextMenu>
          </td>
        </tr>
      </tbody>
    </table>
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
  import Vue from 'vue'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import TrackContextMenu from '@/library/TrackContextMenu.vue'

  export default Vue.extend({
    components: {
      TrackContextMenu,
    },
    props: {
      tracks: { type: Array, required: true },
      noAlbum: { type: Boolean, default: false },
      noArtist: { type: Boolean, default: false },
      noDuration: { type: Boolean, default: false },
    },
    computed: {
      ...mapState('player', {
        isPlaying: 'isPlaying',
      }),
      ...mapGetters({
        playingTrackId: 'player/trackId',
      }),
    },
    methods: {
      ...mapActions({
        playPause: 'player/playPause',
      }),
      play(index: number) {
        if ((this.tracks as any)[index].id === this.playingTrackId) {
          return this.$store.dispatch('player/playPause')
        }
        return this.$store.dispatch('player/playTrackList', {
          index,
          tracks: this.tracks,
        })
      },
      dragstart(id: string, event: any) {
        event.dataTransfer.setData('id', id)
      },
    }
  })
</script>
