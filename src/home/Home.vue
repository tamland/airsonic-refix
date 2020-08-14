<template>
  <div>
    <Spinner v-if="loading" />
    <template v-else>
      <div v-for="section in sections" :key="section.key" class="mb-4">
        <template v-if="$data[section.key].length > 0">
          <h1>{{ section.name }}</h1>
          <AlbumList :items="$data[section.key]" />
        </template>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import { Album } from '@/shared/api'

  export default Vue.extend({
    components: {
      AlbumList,
    },
    data() {
      return {
        loading: true as boolean,
        recent: [] as Album[],
        newest: [] as Album[],
        frequent: [] as Album[],
        random: [] as Album[],
      }
    },
    computed: {
      sections(): any[] {
        return [
          { name: 'Recently added', key: 'newest' },
          { name: 'Recently played', key: 'recent' },
          { name: 'Most played', key: 'frequent' },
          { name: 'Random', key: 'random' },
        ]
      }
    },
    created() {
      const size = 10
      this.$api.getAlbums('newest', size).then(result => {
        this.newest = result
        this.loading = false
      })
      this.$api.getAlbums('recent', size).then(result => {
        this.recent = result
      })
      this.$api.getAlbums('frequent', size).then(result => {
        this.frequent = result
      })
      this.$api.getAlbums('random', 50).then(result => {
        this.random = result
      })
    }
  })
</script>
