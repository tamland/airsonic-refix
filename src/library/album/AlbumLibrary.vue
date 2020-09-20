<template>
  <div>
    <ul class="nav-underlined">
      <li v-for="{ value, text } in options" :key="value">
        <router-link :to="{... $route, params: {... $route.params, sort: value }}">
          {{ text }}
        </router-link>
      </li>
    </ul>
    <AlbumList :items="albums" />
    <InfiniteLoader :key="sort" :loading="loading" :has-more="hasMore" @loadMore="loadMore" />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from './AlbumList.vue'
  import { Album, AlbumSort } from '@/shared/api'

  export default Vue.extend({
    components: {
      AlbumList,
    },
    props: {
      sort: { type: String, required: true },
    },
    data() {
      return {
        albums: [] as | Album[],
        loading: false,
        offset: 0 as number,
        hasMore: true,
      }
    },
    computed: {
      options() {
        return [
          { text: 'A-Z', value: 'a-z' },
          { text: 'Recently added', value: 'recently-added' },
          { text: 'Recently played', value: 'recently-played' },
          { text: 'Most played', value: 'most-played' },
          { text: 'Random', value: 'random' },
        ]
      }
    },
    watch: {
      sort: {
        handler() {
          this.albums = []
          this.offset = 0
          this.hasMore = true
        }
      }
    },
    methods: {
      loadMore() {
        this.loading = true
        this.$api.getAlbums(this.sort as AlbumSort, 50, this.offset).then(albums => {
          this.albums.push(...albums)
          this.offset += albums.length
          this.hasMore = albums.length > 0
          this.loading = false
        })
      }
    }
  })
</script>
