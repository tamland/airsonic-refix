<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <ul class="nav-underlined">
        <li>
          <router-link :to="{... $route, params: {... $route.params, sort: null }}">
            Recently updated
          </router-link>
        </li>
        <li>
          <router-link :to="{... $route, params: {... $route.params, sort: 'a-z' }}">
            A-Z
          </router-link>
        </li>
      </ul>
      <OverflowMenu>
        <ContextMenuItem icon="refresh" @click="refresh()">
          Refresh
        </ContextMenuItem>
      </OverflowMenu>
    </div>
    <ContentLoader v-slot :loading="loading">
      <Tiles square>
        <Tile v-for="item in sortedItems" :key="item.id"
              :image="item.image"
              :to="{name: 'podcast', params: { id: item.id } }"
              :title="item.name">
          <template #text>
            <strong>{{ item.trackCount }}</strong> episodes
          </template>
        </Tile>
      </Tiles>
    </ContentLoader>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { orderBy } from 'lodash-es'

  export default Vue.extend({
    props: {
      sort: { type: String, default: null },
    },
    data() {
      return {
        items: null as null | any[],
      }
    },
    computed: {
      loading(): boolean {
        return this.items === null
      },
      sortedItems(): any[] {
        return this.sort === 'a-z'
          ? orderBy(this.items, 'name')
          : orderBy(this.items, 'albumCount', 'desc')
      },
    },
    async created() {
      this.items = await this.$api.getPodcasts()
    },
    methods: {
      async refresh() {
        await this.$api.refreshPodcasts()
        this.items = await this.$api.getPodcasts()
      }
    }
  })
</script>
