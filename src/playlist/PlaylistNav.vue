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
  import { defineComponent } from 'vue'
  import CreatePlaylistModal from '@/playlist/CreatePlaylistModal.vue'

  export default defineComponent({
    components: {
      CreatePlaylistModal
    },
    data() {
      return {
        playlistName: '',
        showAddModal: false,
      }
    },
    computed: {
      playlists(): any[] | null {
        return this.$store.state.playlists?.slice(0, 10)
      },
    },
    methods: {
      onDrop(playlistId: string, event: any) {
        event.preventDefault()
        const trackId = event.dataTransfer.getData('id')
        return this.$store.dispatch('addTrackToPlaylist', { playlistId, trackId })
      },
      onDragover(event: any) {
        event.preventDefault()
      },
    }
  })
</script>
