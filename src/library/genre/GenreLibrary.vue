<template>
  <div>
    <ul class="nav-underlined mb-3">
      <li>
        <router-link :to="{... $route, params: {... $route.params, sort: 'most-albums' }}">
          Most albums
        </router-link>
      </li>
      <li>
        <router-link :to="{... $route, params: {... $route.params, sort: 'a-z' }}">
          A-Z
        </router-link>
      </li>
    </ul>
    <ContentLoader v-slot :loading="loading">
      <Tiles v-if="sortedItems.length > 0">
        <Tile v-for="item in sortedItems" :key="item.id"
              :to="{name: 'genre', params: { id: item.id } }"
              :title="item.name" :image="item.image">
          <template #text>
            <strong>{{ item.albumCount }}</strong> albums •
            <strong>{{ item.trackCount }}</strong> tracks
          </template>
        </Tile>
      </Tiles>
      <EmptyIndicator v-else />
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { orderBy } from 'lodash-es'

  export default defineComponent({
    props: {
      sort: { type: String, default: null },
    },
    data() {
      return {
        loading: true,
        items: [],
      }
    },
    computed: {
      sortedItems(): any[] {
        return this.sort === 'a-z'
          ? orderBy(this.items, 'name')
          : orderBy(this.items, 'albumCount', 'desc')
      },
    },
    async created() {
      this.items = await this.$api.getGenres()
      this.loading = false
    },
  })
</script>
