<template>
  <div>
    <ul class="nav-underlined">
      <li v-for="{ value, text } in options" :key="value">
        <router-link :to="{... $route, params: {... $route.params, sort: value }}">
          {{ text }}
        </router-link>
      </li>
    </ul>
    <ContentLoader #default :loading="albums == null">
      <AlbumList :items="albums" />
    </ContentLoader>
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
        albums: null as null | Album[],
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
        immediate: true,
        handler(value: AlbumSort) {
          this.albums = null
          this.$api.getAlbums(value).then(albums => {
            this.albums = albums
          })
        }
      }
    },
  })
</script>
