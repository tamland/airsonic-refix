<template>
  <Spinner v-slot="{ data }" :data="playlist">
    <div class="d-flex justify-content-between">
      <h1>{{ data.name }}</h1>
      <OverflowMenu>
        <b-dropdown-item-btn variant="danger" @click="deletePlaylist()">
          Delete playlist
        </b-dropdown-item-btn>
      </OverflowMenu>
    </div>
    <TrackList :tracks="data.tracks" @remove="remove(index)">
      <template v-slot:context-menu="{index}">
        <b-dropdown-item-button @click="remove(index)">
          Remove
        </b-dropdown-item-button>
      </template>
    </TrackList>
  </Spinner>
</template>
<script lang="ts">
  import Vue from 'vue'
  import TrackList from '@/library/TrackList.vue'

  export default Vue.extend({
    components: {
      TrackList,
    },
    props: {
      id: { type: String, required: true }
    },
    data() {
      return {
        playlist: null as any,
      }
    },
    watch: {
      id: {
        immediate: true,
        handler(value: string) {
          this.playlist = null
          this.$api.getPlaylist(value).then(playlist => {
            this.playlist = playlist// .sort((a: any, b:any) => a.created.localeCompare(b.created));
          })
        }
      }
    },
    methods: {
      remove(index: number) {
        this.playlist.tracks.splice(index, 1)
        return this.$api.removeFromPlaylist(this.id, index.toString())
      },
      deletePlaylist() {
        return this.$store.dispatch('deletePlaylist', this.id).then(() => {
          this.$router.replace({ name: 'playlists' })
        })
      },
    }
  })
</script>
