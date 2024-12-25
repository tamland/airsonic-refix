<template>
  <ContentLoader v-slot :loading="playlist == null">
    <div class="d-flex align-items-center mb-2">
      <h1 class="mb-0 mr-2 text-truncate">
        {{ playlist.name }}
      </h1>
      <OverflowMenu class="ml-auto">
        <ContextMenuItem icon="edit" :disabled="playlist.isReadOnly" @click="showEditModal = true">
          Edit
        </ContextMenuItem>
        <b-dropdown-divider />
        <ContextMenuItem icon="x" variant="danger" :disabled="playlist.isReadOnly" @click="deletePlaylist()">
          Delete
        </ContextMenuItem>
      </OverflowMenu>
    </div>

    <div class="d-flex flex-wrap align-items-center">
      <span class="text-nowrap">
        <strong>{{ playlist.trackCount }}</strong> tracks
      </span>
      <span class="mx-1">•</span>
      <strong>{{ formatDuration(playlist.duration) }}</strong>
      <template v-if="playlist.isPublic">
        <span class="mx-1">•</span>
        <span class="badge badge-secondary badge-pill">
          Public
        </span>
      </template>
    </div>

    <div v-if="playlist.comment" class="mt-3">
      {{ playlist.comment }}
    </div>

    <div class="text-nowrap mt-3">
      <b-button variant="secondary" :disabled="playlist.tracks.length === 0" class="mr-2" @click="playNow">
        <Icon icon="play" /> Play
      </b-button>
      <b-button variant="secondary" :disabled="playlist.tracks.length === 0" @click="shuffleNow">
        <Icon icon="shuffle" /> Shuffle
      </b-button>
    </div>

    <TrackList v-if="playlist.tracks.length > 0" :tracks="playlist.tracks" class="mt-3">
      <template #context-menu="{index}">
        <b-dropdown-divider />
        <ContextMenuItem icon="x" variant="danger" :disabled="playlist.isReadOnly" @click="removeTrack(index)">
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
          <SwitchInput v-model="item.isPublic" />
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
  import SwitchInput from '@/shared/components/SwitchInput.vue'
  import { formatDuration } from '@/shared/utils'

  export default defineComponent({
    components: {
      SwitchInput,
      TrackList,
      EditModal,
    },
    props: {
      id: { type: String, required: true }
    },
    setup() {
      return {
        playlistStore: usePlaylistStore(),
        formatDuration,
      }
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
            this.playlist = playlist
          })
        }
      }
    },
    methods: {
      playNow() {
        return this.$store.dispatch('player/playNow', {
          tracks: this.playlist.tracks,
        })
      },
      shuffleNow() {
        return this.$store.dispatch('player/shuffleNow', {
          tracks: this.playlist.tracks,
        })
      },
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
