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
  import { computed, defineComponent, ref } from 'vue'
  import CreatePlaylistModal from '@/playlist/CreatePlaylistModal.vue'
  import { orderBy } from 'lodash-es'
  import { usePlaylistStore } from '@/playlist/store'

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
            : orderBy(store.playlists, 'createdAt', 'desc'))
      }
    },
  })
</script>
