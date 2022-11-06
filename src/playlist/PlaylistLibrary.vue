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
      <OverflowMenu>
        <ContextMenuItem icon="plus" @click="showAddModal = true">
          Add
        </ContextMenuItem>
      </OverflowMenu>
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
      </Tile>
    </Tiles>
    <EmptyIndicator v-else />
    <CreatePlaylistModal :visible.sync="showAddModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import CreatePlaylistModal from '@/playlist/CreatePlaylistModal.vue'
  import { orderBy } from 'lodash-es'

  export default defineComponent({
    components: {
      CreatePlaylistModal,
    },
    props: {
      sort: { type: String, default: null },
    },
    data() {
      return {
        showAddModal: false,
      }
    },
    computed: {
      items(): any[] {
        const playlists = this.$store.state.playlists
        return this.sort === 'a-z'
          ? orderBy(playlists, 'name')
          : orderBy(playlists, 'createdAt', 'desc')
      },
      loading(): boolean {
        return this.$store.state.playlists === null
      }
    },
  })
</script>
