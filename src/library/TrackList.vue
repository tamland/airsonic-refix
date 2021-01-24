<template>
  <table class="table table-hover table-borderless table-numbered">
    <thead>
      <tr>
        <th>
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
        <td>
          <button>
            <Icon class="icon" :icon="isPlaying && item.id === playingTrackId ? 'pause-fill' :'play-fill'" />
            <span class="number">{{ item.track || 1 }}</span>
          </button>
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
          <template v-if="item.albumId">
            <router-link :to="{name: 'album', params: {id: item.albumId}}" disabled @click.native.stop>
              {{ item.album }}
            </router-link>
          </template>
          <template v-else>
            {{ item.album }}
          </template>
        </td>
        <td v-if="!noDuration" class="text-right d-none d-md-table-cell">
          {{ $formatDuration(item.duration) }}
        </td>
        <td class="text-right" @click.stop="">
          <TrackContextMenu :track="item">
            <slot name="context-menu" :index="index" :item="item" />
          </TrackContextMenu>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapActions, mapGetters } from 'vuex'
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
      ...mapGetters({
        playingTrackId: 'player/trackId',
        isPlaying: 'player/isPlaying',
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
