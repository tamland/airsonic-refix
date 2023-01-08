<template>
  <td class="text-right" @click.stop="">
    <OverflowMenu>
      <ContextMenuItem v-if="!track.isUnavailable" icon="plus" @click="setNextInQueue()">
        Play next
      </ContextMenuItem>
      <ContextMenuItem v-if="!track.isUnavailable" icon="plus" @click="addToQueue()">
        Add to queue
      </ContextMenuItem>
      <ContextMenuItem v-if="!track.isStream" icon="plus" @click="showPlaylistSelect = true">
        Add to playlist
      </ContextMenuItem>
      <ContextMenuItem v-if="!track.isStream" :icon="isFavourite ? 'heart-fill' : 'heart'" @click="toggleFavourite()">
        Favourite
      </ContextMenuItem>
      <ContextMenuItem v-if="!track.isStream" icon="download" @click="download()">
        Download
      </ContextMenuItem>
      <slot :item="track" />
    </OverflowMenu>

    <b-modal
      v-model="showPlaylistSelect"
      title="Add to playlist" ok-only ok-variant="secondary" ok-title="Cancel"
      size="md"
    >
      <template #modal-header-close>
        <Icon icon="x" />
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
  import { usePlaylistStore } from '@/playlist/store'

  export default defineComponent({
    props: {
      track: { type: Object, required: true },
    },
    setup() {
      return {
        favouriteStore: useFavouriteStore(),
        playlistStore: usePlaylistStore(),
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
        return this.$store.dispatch('player/setNextInQueue', [this.track])
      },
      addToQueue() {
        return this.$store.dispatch('player/addToQueue', [this.track])
      },
      addToPlaylist(playlistId: string) {
        this.showPlaylistSelect = false
        return this.playlistStore.addTracks(playlistId, [this.track.id])
      },
    }
  })
</script>
