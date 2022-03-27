<template>
  <div>
    <div class="d-flex justify-content-between align-items-start +mb-2">
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
      <CreatePlaylistBtn class="btn btn-secondary">
        New
      </CreatePlaylistBtn>
    </div>
    <Tiles square>
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
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import CreatePlaylistBtn from '@/playlist/CreatePlaylistBtn.vue'
  import { orderBy } from 'lodash-es'

  export default Vue.extend({
    components: {
      CreatePlaylistBtn,
    },
    props: {
      sort: { type: String, default: null },
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
