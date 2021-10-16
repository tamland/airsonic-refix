<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0">
        Playlists
      </h1>
      <CreatePlaylistBtn class="btn btn-secondary">
        New
      </CreatePlaylistBtn>
    </div>
    <Tiles square>
      <Tile v-for="item in playlists" :key="item.id"
            :image="item.image"
            :to="{name: 'playlist', params: { id: item.id } }"
            :title="item.name">
        <template #text>
          <strong>{{ item.songCount }}</strong> songs
        </template>
      </Tile>
    </Tiles>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapState } from 'vuex'
  import CreatePlaylistBtn from '@/playlist/CreatePlaylistBtn.vue'

  export default Vue.extend({
    components: {
      CreatePlaylistBtn,
    },
    computed: {
      ...mapState(['playlists']),
    },
  })
</script>
