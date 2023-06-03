<template>
  <ContentLoader v-slot :loading="playlist == null">
    <div class="d-flex justify-content-between">
      <h1>{{ playlist.name }}</h1>
      <OverflowMenu>
        <ContextMenuItem icon="edit" @click="showEditModal = true">
          Edit
        </ContextMenuItem>
        <b-dropdown-divider />
        <ContextMenuItem icon="x" variant="danger" @click="deletePlaylist()">
          Delete
        </ContextMenuItem>
      </OverflowMenu>
    </div>
    <p v-if="playlist.isPublic || playlist.comment" class="text-muted">
      {{ playlist.comment | prependPublic(playlist.isPublic) }}
    </p>
    <TrackList v-if="playlist.tracks.length > 0" :tracks="playlist.tracks">
      <template #context-menu="{index}">
        <b-dropdown-divider />
        <ContextMenuItem icon="x" variant="danger" @click="removeTrack(index)">
          Remove
        </ContextMenuItem>
      </template>
    </TrackList>
    <EmptyIndicator v-else />
    <EditModal :visible.sync="showEditModal" :item="playlist" @confirm="updatePlaylist">
      <template #title>
        Edit playlist
      </template>
      <template #default="{ item }">
        <div class="form-group">
          <label>Name</label>
          <input v-model="item.name" class="form-control" type="text">
        </div>
        <div class="form-group">
          <label>Comment</label>
          <textarea v-model="item.comment" class="form-control" />
        </div>
        <div class="form-group">
          <label class="mb-0">Public</label>
          <b-form-checkbox v-model="item.isPublic" switch />
        </div>
      </template>
    </EditModal>
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import TrackList from '@/library/track/TrackList.vue'
  import EditModal from '@/shared/components/EditModal.vue'
  import { usePlaylistStore } from '@/library/playlist/store'

  export default defineComponent({
    components: {
      TrackList,
      EditModal,
    },
    props: {
      id: { type: String, required: true }
    },
    setup() {
      return { playlistStore: usePlaylistStore() }
    },
    data() {
      return {
        playlist: null as any,
        showEditModal: false,
      }
    },
    filters: {
      prependPublic: function(value: string, isPublic: boolean) {
        return isPublic ? '[Public] ' + value : value
      }
    },
    watch: {
      id: {
        immediate: true,
        handler(value: string) {
          this.playlist = null
          this.$api.getPlaylist(value).then(playlist => {
            this.playlist = playlist
          })
        }
      }
    },
    methods: {
      removeTrack(index: number) {
        this.playlist.tracks.splice(index, 1)
        return this.playlistStore.removeTrack(this.id, index)
      },
      updatePlaylist(value: any) {
        this.playlist = value
        return this.playlistStore.update(this.playlist)
      },
      deletePlaylist() {
        return this.playlistStore.delete(this.id).then(() => {
          this.$router.replace({ name: 'playlists' })
        })
      },
    }
  })
</script>
