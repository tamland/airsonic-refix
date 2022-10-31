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
    <p v-if="playlist.comment" class="text-muted">
      {{ playlist.comment }}
    </p>
    <TrackList v-if="playlist.tracks.length > 0" :tracks="playlist.tracks">
      <template #context-menu="{index}">
        <b-dropdown-divider />
        <ContextMenuItem icon="x" variant="danger" @click="remove(index)">
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
      </template>
    </EditModal>
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import TrackList from '@/library/track/TrackList.vue'
  import EditModal from '@/shared/components/EditModal.vue'

  export default defineComponent({
    components: {
      TrackList,
      EditModal,
    },
    props: {
      id: { type: String, required: true }
    },
    data() {
      return {
        playlist: null as any,
        showEditModal: false,
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
      updatePlaylist(value: any) {
        this.playlist = value
        return this.$store.dispatch('updatePlaylist', this.playlist)
      },
      deletePlaylist() {
        return this.$store.dispatch('deletePlaylist', this.id).then(() => {
          this.$router.replace({ name: 'playlists' })
        })
      },
    }
  })
</script>
