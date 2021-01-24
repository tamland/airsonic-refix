<template>
  <ContentLoader v-slot :loading="playlist == null">
    <div class="d-flex justify-content-between">
      <h1>{{ playlist.name }}</h1>
      <OverflowMenu>
        <b-dropdown-item-btn @click="showEditModal = true">
          Edit playlist
        </b-dropdown-item-btn>
        <b-dropdown-item-btn variant="danger" @click="deletePlaylist()">
          Delete playlist
        </b-dropdown-item-btn>
      </OverflowMenu>
    </div>
    <p v-if="playlist.comment" class="text-muted">
      {{ playlist.comment }}
    </p>
    <TrackList :tracks="playlist.tracks" @remove="remove(index)">
      <template #context-menu="{index}">
        <b-dropdown-item-button @click="remove(index)">
          Remove
        </b-dropdown-item-button>
      </template>
    </TrackList>
    <EditModal :visible.sync="showEditModal" :item="playlist" @confirm="updatePlaylist">
      <template #title>
        Edit playlist
      </template>
      <template #default="{ item }">
        <b-form-group label="Name">
          <b-form-input v-model="item.name" type="text" />
        </b-form-group>
        <b-form-group label="Comment">
          <b-form-textarea v-model="item.comment" />
        </b-form-group>
      </template>
    </EditModal>
  </ContentLoader>
</template>
<script lang="ts">
  import Vue from 'vue'
  import TrackList from '@/library/TrackList.vue'
  import EditModal from '@/shared/components/EditModal.vue'

  export default Vue.extend({
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
