<template>
  <td class="text-right" @click.stop="">
    <OverflowMenu :disabled="!track.url">
      <ContextMenuItem icon="plus" @click="setNextInQueue()">
        Play next
      </ContextMenuItem>
      <ContextMenuItem icon="plus" @click="addToQueue()">
        Add to queue
      </ContextMenuItem>
      <ContextMenuItem icon="plus" @click="showPlaylistSelect = true">
        Add to playlist
      </ContextMenuItem>
      <ContextMenuItem :icon="isFavourite ? 'heart-fill' : 'heart'" @click="toggleFavourite()">
        Favourite
      </ContextMenuItem>
      <ContextMenuItem icon="download" @click="download()">
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
          v-for="item in playlists" :key="item.id"
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
  import { defineComponent } from '@vue/composition-api'

  export default defineComponent({
    props: {
      track: { type: Object, required: true },
    },
    data() {
      return {
        showPlaylistSelect: false,
      }
    },
    computed: {
      isFavourite(): boolean {
        return !!this.$store.state.favourites.tracks[this.track.id]
      },
      playlists(): any[] {
        return this.$store.state.playlists
      },
    },
    methods: {
      toggleFavourite() {
        return this.$store.dispatch('favourites/toggle', { id: this.track.id, type: 'track' })
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
        return this.$store.dispatch('addTrackToPlaylist', {
          playlistId,
          trackId: this.track.id
        })
      },
    }
  })
</script>
