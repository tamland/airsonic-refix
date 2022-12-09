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
      <ArtistList :items="sortedItems" />
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import ArtistList from './ArtistList.vue'
  import { Artist } from '@/shared/api'
  import { orderBy } from 'lodash-es'

  export default defineComponent({
    components: {
      ArtistList,
    },
    props: {
      sort: { type: String, default: null },
    },
    data() {
      return {
        loading: true,
        items: [] as readonly Artist[]
      }
    },
    computed: {
      options() {
        return [
          { text: 'Most albums', value: 'most-albums' },
          { text: 'A-Z', value: 'a-z' },
        ]
      },
      sortedItems(): Artist[] {
        return this.sort === 'most-albums'
          ? orderBy(this.items, 'albumCount', 'desc')
          : orderBy(this.items, 'name')
      },
    },
    async created() {
      this.items = Object.freeze(await this.$api.getArtists())
      this.loading = false
    }
  })
</script>
