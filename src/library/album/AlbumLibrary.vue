<template>
  <div>
    <Spinner v-slot="{ data }" :data="albums">
      <AlbumList :items="data" />
    </Spinner>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from './AlbumList.vue'
  import { AlbumSort, Album } from '@/shared/api'

  export default Vue.extend({
    components: {
      AlbumList,
    },
    data() {
      return {
        sort: 'newest',
        albums: null as null | Album[],
      }
    },
    computed: {
      sortOptions() {
        return [
          { text: 'A-Z', value: 'alphabeticalByName' },
          { text: 'Date', value: 'newest' },
          { text: 'frequent', value: 'frequent' },
        // { text: "random", value: "random" },
        // { text: "recent", value: "recent" },
        // { text: "starred", value: "starred" },
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
