<template>
  <button @click="showModal = true">
    <slot />
    <b-modal v-model="showModal" title="New playlist">
      <template #modal-header-close>
        <Icon icon="x" />
      </template>
      <b-form-group label="Name">
        <b-form-input v-model="name" type="text" />
      </b-form-group>
      <template #modal-footer>
        <b-button variant="primary" @click="createPlaylist">
          Create
        </b-button>
      </template>
    </b-modal>
  </button>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
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
