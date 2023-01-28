<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <ul class="nav-underlined">
        <li>
          <router-link :to="{... $route, params: {... $route.params, sort: null }}">
            Recently added
          </router-link>
        </li>
        <li>
          <router-link :to="{... $route, params: {... $route.params, sort: 'a-z' }}">
            A-Z
          </router-link>
        </li>
      </ul>
      <b-button variant="link" @click="showAddModal = true">
        <Icon icon="plus" />
      </b-button>
    </div>
    <Tiles v-if="items.length > 0" square>
      <Tile
        v-for="item in items" :key="item.id"
        :image="item.image"
        :to="{name: 'playlist', params: { id: item.id } }"
        :title="item.name">
        <template #text>
          <strong>{{ item.trackCount }}</strong> tracks
        </template>
        <template #context-menu>
          <ContextMenuItem icon="play" @click="playNow(item.id)">
            Play
          </ContextMenuItem>
          <ContextMenuItem icon="plus" @click="playNext(item.id)">
            Play next
          </ContextMenuItem>
          <ContextMenuItem icon="plus" @click="playLater(item.id)">
            Add to queue
          </ContextMenuItem>
        </template>
      </Tile>
    </Tiles>
    <EmptyIndicator v-else />
    <CreatePlaylistModal :visible.sync="showAddModal" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue'
  import CreatePlaylistModal from '@/library/playlist/CreatePlaylistModal.vue'
  import { orderBy } from 'lodash-es'
  import { usePlaylistStore } from '@/library/playlist/store'

  export default defineComponent({
    components: {
      CreatePlaylistModal,
    },
    props: {
      sort: { type: String, default: null },
    },
    setup(props) {
      const store = usePlaylistStore()
      return {
        showAddModal: ref(false),
        loading: computed(() => store.playlists === null),
        items: computed(() =>
          props.sort === 'a-z'
            ? orderBy(store.playlists, 'name')
            : orderBy(store.playlists, 'createdAt', 'desc')),
      }
    },
    methods: {
      async playNow(id: string) {
        const playlist = await this.$api.getPlaylist(id)
        return this.$store.dispatch('player/playTrackList', {
          tracks: playlist.tracks,
        })
      },
      async playNext(id: string) {
        const playlist = await this.$api.getPlaylist(id)
        return this.$store.dispatch('player/setNextInQueue', playlist.tracks)
      },
      async playLater(id: string) {
        const playlist = await this.$api.getPlaylist(id)
        return this.$store.dispatch('player/addToQueue', playlist.tracks)
      },
    }
  })
</script>
