<template>
  <td class="text-end" @click.stop="">
    <OverflowMenu>
      <DropdownItem v-if="!track.isUnavailable" icon="plus" @click="setNextInQueue()">
        Play next
      </DropdownItem>
      <DropdownItem v-if="!track.isUnavailable" icon="plus" @click="addToQueue()">
        Add to queue
      </DropdownItem>
      <DropdownItem v-if="!track.isStream" icon="plus" @click="showPlaylistSelect = true">
        Add to playlist
      </DropdownItem>
      <DropdownItem v-if="!track.isStream" :icon="isFavourite ? 'heart-fill' : 'heart'" @click="toggleFavourite()">
        Favourite
      </DropdownItem>
      <DropdownItem v-if="!track.isStream" icon="download" @click="download()">
        Download
      </DropdownItem>
      <slot :item="track" />
    </OverflowMenu>

    <b-modal v-model="showPlaylistSelect" ok-only ok-variant="transparent" ok-title="Cancel" size="md">
      <template #header>
        <h5 class="modal-title">
          Add to playlist
        </h5>
        <button class="btn-close" @click="showPlaylistSelect = false" />
      </template>
      <div class="list-group list-group-flush">
        <button
          v-for="item in playlistStore.playlists" :key="item.id"
          type="button" class="list-group-item list-group-item-action text-truncate"
          @click="addToPlaylist(item.id)"
        >
          {{ item.name }}
        </button>
      </div>
    </b-modal>
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { useFavouriteStore } from '@/library/favourite/store'
  import { usePlaylistStore } from '@/library/playlist/store'
  import { usePlayerStore } from '@/player/store'
  import { Track } from '@/shared/api'

  export default defineComponent({
    props: {
      track: { type: Object, required: true },
    },
    setup() {
      return {
        favouriteStore: useFavouriteStore(),
        playlistStore: usePlaylistStore(),
        playerStore: usePlayerStore(),
      }
    },
    data() {
      return {
        showPlaylistSelect: false,
      }
    },
    computed: {
      isFavourite(): boolean {
        return !!this.favouriteStore.tracks[this.track.id]
      },
    },
    methods: {
      toggleFavourite() {
        return this.favouriteStore.toggle('track', this.track.id)
      },
      download() {
        window.location.href = this.$api.getDownloadUrl(this.track.id)
      },
      setNextInQueue() {
        return this.playerStore.setNextInQueue([this.track as Track])
      },
      addToQueue() {
        return this.playerStore.addToQueue([this.track as Track])
      },
      addToPlaylist(playlistId: string) {
        this.showPlaylistSelect = false
        return this.playlistStore.addTracks(playlistId, [this.track.id])
      },
    }
  })
</script>
