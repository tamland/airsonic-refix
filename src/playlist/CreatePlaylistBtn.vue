<template>
  <button @click="showModal = true">
    <slot />
    <b-modal v-model="showModal" title="New playlist">
      <template #modal-header-close>
        <Icon icon="x" />
      </template>
      <div class="form-group">
        <label>Name</label>
        <input v-model="name" class="form-control" type="text">
      </div>
      <template #modal-footer>
        <b-button variant="primary" @click="createPlaylist">
          Create
        </b-button>
      </template>
    </b-modal>
  </button>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    data() {
      return {
        name: '',
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
        const name = this.name
        this.name = ''
        this.showModal = false
        return this.$store.dispatch('createPlaylist', name)
      },
    }
  })
</script>
