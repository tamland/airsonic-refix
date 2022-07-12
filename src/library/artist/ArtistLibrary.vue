<template>
  <div>
    <ul class="nav-underlined mb-3">
      <li>
        <router-link :to="{... $route, params: {... $route.params, sort: null }}">
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
      <ArtistList :items="sortedItems" />
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
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
      sortedItems(): Artist[] {
        return this.sort === 'a-z'
          ? orderBy(this.items, 'name')
          : orderBy(this.items, 'albumCount', 'desc')
      },
    },
    async created() {
      this.items = Object.freeze(await this.$api.getArtists())
      this.loading = false
    }
  })
</script>
