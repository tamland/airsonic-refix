<template>
  <ContentLoader :loading="loading">
    <div v-for="section in sections" :key="section.key" class="mb-4">
      <template v-if="result[section.key].length > 0">
        <h3>
          {{ section.name }}
          <router-link
            :to="{name: 'albums', params: {sort: section.key}}"
            class="text-muted"
          >
            <Icon icon="chevron-right" />
          </router-link>
        </h3>
        <AlbumList :items="result[section.key]" allow-h-scroll />
      </template>
    </div>

    <div v-if="result.genres.length > 0" class="mb-4">
      <h3>Genres</h3>
      <div class="d-flex flex-wrap gap-3">
        <span v-for="item in result.genres" :key="item.id" class="text-bg-secondary rounded-pill py-2 px-3 +mb-2 +me-2">
          <router-link :to="{name: 'genre', params: { id: item.id } }">
            {{ item.name }}
          </router-link>
        </span>
      </div>
    </div>

    <div v-if="result.random.length > 0" class="mb-4">
      <h3>
        Random
        <router-link :to="{name: 'albums', params: {sort: 'random'}}" class="text-muted">
          <Icon icon="chevron-right" />
        </router-link>
      </h3>
      <AlbumList :items="result.random" allow-h-scroll />
    </div>

    <EmptyIndicator v-if="empty" />
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import AlbumList from '@/library/album/AlbumList.vue'
  import { Album, Genre } from '@/shared/api'
  import { orderBy } from 'lodash-es'

  export default defineComponent({
    components: {
      AlbumList,
    },
    data() {
      return {
        loading: true as boolean,
        result: {
          'recently-added': [] as Album[],
          'recently-played': [] as Album[],
          'most-played': [] as Album[],
          random: [] as Album[],
          genres: [] as Genre[],
        }
      }
    },
    computed: {
      sections(): any[] {
        return [
          { name: 'Recently added', key: 'recently-added' },
          { name: 'Recently played', key: 'recently-played' },
          { name: 'Most played', key: 'most-played' },
        ]
      },
      empty() {
        return Object.values(this.result).findIndex(x => x.length > 0) === -1
      }
    },
    created() {
      const size = 18
      this.$api.getAlbums('recently-added', size).then(result => {
        this.result['recently-added'] = result
        this.loading = false
      })
      this.$api.getAlbums('recently-played', size).then(result => {
        this.result['recently-played'] = result
      })
      this.$api.getAlbums('most-played', size).then(result => {
        this.result['most-played'] = result
      })
      this.$api.getAlbums('random', 50).then(result => {
        this.result.random = result
      })
      this.$api.getGenres().then(result => {
        this.result.genres = orderBy(result, 'albumCount', 'desc')
      })
    }
  })
</script>
