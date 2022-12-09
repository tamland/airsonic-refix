<template>
  <div>
    <ul class="nav-underlined mb-3">
      <li v-for="{ value, text } in options" :key="value">
        <router-link :to="{... $route, params: {... $route.params, sort: value }}">
          {{ text }}
        </router-link>
      </li>
    </ul>
    <ContentLoader v-slot :loading="loading">
      <Tiles>
        <Tile v-for="item in sortedItems" :key="item.id"
              :to="{name: 'genre', params: { id: item.id } }"
              :title="item.name" :image="item.image">
          <template #text>
            <strong>{{ item.albumCount }}</strong> albums •
            <strong>{{ item.trackCount }}</strong> tracks
          </template>
        </Tile>
      </Tiles>
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
      options() {
        return [
          { text: 'Most albums', value: 'most-albums' },
          { text: 'A-Z', value: 'a-z' },
        ]
      },
      sortedItems(): any[] {
        return this.sort === 'most-albums'
          ? orderBy(this.items, 'albumCount', 'desc')
          : orderBy(this.items, 'name')
      },
    },
    async created() {
      this.items = await this.$api.getGenres()
      this.loading = false
    },
  })
</script>
