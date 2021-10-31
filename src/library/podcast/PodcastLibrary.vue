<template>
  <ContentLoader v-slot :loading="items == null">
    <div class="d-flex justify-content-between">
      <h1>Podcasts</h1>
      <OverflowMenu>
        <ContextMenuItem icon="refresh" @click="refresh()">
          Refresh
        </ContextMenuItem>
      </OverflowMenu>
    </div>
    <Tiles square>
      <Tile v-for="item in items" :key="item.id"
            :image="item.image"
            :to="{name: 'podcast', params: { id: item.id } }"
            :title="item.name">
        <template #text>
          <strong>{{ item.trackCount }}</strong> episodes
        </template>
      </Tile>
    </Tiles>
  </ContentLoader>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {
        items: null as null | any[],
      }
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
