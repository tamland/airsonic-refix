<template>
  <ContentLoader v-slot :loading="playlist == null">
    <Hero :image="playlist.image">
      <small>Playlist</small>
      <h1 class="display-5 fw-bold">
        {{ playlist.name }}
      </h1>

      <div class="d-flex flex-wrap align-items-center">
        <span class="text-nowrap">
          <strong>{{ playlist.trackCount }}</strong> tracks
        </span>
        <span class="mx-2">•</span>
        <strong>{{ formatDuration(playlist.duration) }}</strong>
        <template v-if="playlist.isPublic">
          <span class="mx-2">•</span>
          <span class="badge bg-secondary rounded-pill">
            Public
          </span>
        </template>
      </div>

      <OverflowFade v-if="playlist.comment" class="mt-3">
        {{ playlist.comment }}
      </OverflowFade>

      <div class="text-nowrap mt-3">
        <b-button variant="light" :disabled="playlist.tracks.length === 0" class="me-2" @click="playNow">
          <Icon icon="play" /> Play
        </b-button>
        <b-button variant="transparent" class="me-2" :disabled="playlist.tracks.length === 0" title="Shuffle" @click="shuffleNow">
          <Icon icon="shuffle" />
        </b-button>
        <OverflowMenu variant="transparent" class="ms-auto">
          <DropdownItem icon="edit" :disabled="playlist.isReadOnly" @click="showEditModal = true">
            Edit
          </DropdownItem>
          <hr class="dropdown-divider">
          <DropdownItem icon="x" variant="danger" :disabled="playlist.isReadOnly" @click="deletePlaylist()">
            Delete
          </DropdownItem>
        </OverflowMenu>
      </div>
    </Hero>

    <TrackList v-if="playlist.tracks.length > 0" :tracks="playlist.tracks" class="mt-3">
      <template #context-menu="{index}">
        <hr class="dropdown-divider">
        <DropdownItem icon="x" variant="danger" :disabled="playlist.isReadOnly" @click="removeTrack(index)">
          Remove
        </DropdownItem>
      </template>
    </TrackList>
    <EmptyIndicator v-else />
    <EditModal :visible.sync="showEditModal" :item="playlist" @confirm="updatePlaylist">
      <template #title>
        Edit playlist
      </template>
      <template #default="{ item }">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input v-model="item.name" class="form-control" type="text">
        </div>
        <div class="mb-3">
          <label class="form-label">Comment</label>
          <textarea v-model="item.comment" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Public</label>
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
  import { usePlayerStore } from '@/player/store'
  import OverflowFade from '@/shared/components/OverflowFade.vue'

  export default defineComponent({
    components: {
      OverflowFade,
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
        playerStore: usePlayerStore(),
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
        return this.playerStore.playNow(this.playlist.tracks)
      },
      shuffleNow() {
        return this.playerStore.shuffleNow(this.playlist.tracks)
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
