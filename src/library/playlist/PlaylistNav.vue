<template>
  <div class="mw-100">
    <small class="sidebar-heading text-muted">
      Playlists
      <button type="button" class="btn btn-link btn-sm p-0 float-right" @click="showAddModal = true">
        <Icon icon="plus" />
      </button>
      <CreatePlaylistModal :visible.sync="showAddModal" />
    </small>

    <router-link class="nav-link" :to="{name: 'playlist', params: { id: 'random' }}">
      <Icon icon="playlist" class="mr-2" /> Random
    </router-link>

    <template v-if="playlists">
      <router-link
        v-for="item in playlists" :key="item.id"
        :to="{name: 'playlist', params: { id: item.id }}"
        class="nav-link"
      >
        <span @dragover="onDragover" @drop="onDrop(item.id, $event)">
          <Icon icon="playlist" class="mr-2" /> {{ item.name }}
        </span>
      </router-link>
    </template>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import CreatePlaylistModal from '@/library/playlist/CreatePlaylistModal.vue'
  import { usePlaylistStore } from '@/library/playlist/store'

  export default defineComponent({
    components: {
      CreatePlaylistModal
    },
    setup() {
      const store = usePlaylistStore()
      const playlists = computed(() => {
        return store.playlists?.slice(0, 10)
      })
      return {
        playlists,
        addTracks: store.addTracks
      }
    },
    data() {
      return {
        playlistName: '',
        showAddModal: false,
      }
    },
    methods: {
      async onDrop(playlistId: string, event: any) {
        event.preventDefault()
        const trackId = event.dataTransfer.getData('application/x-track-id')
        if (trackId) {
          return this.addTracks(playlistId, [trackId])
        }
        const albumId = event.dataTransfer.getData('application/x-album-id')
        if (albumId) {
          const album = await this.$api.getAlbumDetails(albumId)
          return this.addTracks(
            playlistId, album.tracks!.map(item => item.id)
          )
        }
      },
      onDragover(event: DragEvent) {
        if (
          event.dataTransfer?.types.includes('application/x-track-id') ||
          event.dataTransfer?.types.includes('application/x-album-id')
        ) {
          event.dataTransfer.dropEffect = 'copy'
          event.preventDefault()
        }
      },
    }
  })
</script>
