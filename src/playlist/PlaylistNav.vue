<template>
  <div style="max-width: 100%">
    <small class="sidebar-heading text-muted">
      Playlists
      <CreatePlaylistBtn class="btn btn-link btn-sm p-0 float-right">
        <Icon icon="plus" />
      </CreatePlaylistBtn>
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
  import CreatePlaylistBtn from '@/playlist/CreatePlaylistBtn.vue'

  export default defineComponent({
    components: {
      CreatePlaylistBtn
    },
    data() {
      return {
        playlistName: '',
        showModal: false,
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
