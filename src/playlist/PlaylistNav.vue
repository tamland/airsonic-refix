<template>
  <div>
    <span class="nav-link">
      <small class="text-uppercase text-muted font-weight-bold">
        Playlists
        <button class="btn btn-link btn-sm p-0 float-right" @click="showModal = true">
          <Icon icon="plus" />
        </button>
      </small>
    </span>

    <router-link class="nav-item nav-link" :to="{name: 'playlist', params: { id: 'random' }}">
      <Icon icon="music-note-list" class="mr-2" /> Random
    </router-link>

    <router-link v-for="item in playlists" :key="item.id"
                 :to="{name: 'playlist', params: { id: item.id }}"
                 class="nav-item nav-link">
      <span @dragover="onDragover" @drop="onDrop(item.id, $event)">
        <Icon icon="music-note-list" class="mr-2" /> {{ item.name }}
      </span>
    </router-link>

    <router-link class="nav-item nav-link" :to="{name: 'playlists'}">
      More...
    </router-link>

    <b-modal v-model="showModal" title="New playlist">
      <b-form-group label="Name">
        <b-form-input v-model="playlistName" type="text" />
      </b-form-group>
      <template #modal-footer>
        <b-button variant="primary" @click="createPlaylist">
          Create
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {
        playlistName: '',
        showModal: false,
      }
    },
    computed: {
      playlists() {
        return this.$store.state.playlists.slice(0, 10)
      },
    },
    methods: {
      createPlaylist() {
        const name = this.playlistName
        this.playlistName = ''
        this.showModal = false
        return this.$store.dispatch('createPlaylist', name)
      },
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
