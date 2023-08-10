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
      <div>
        <b-button variant="link" class="mr-2" @click="showAddModal = true">
          <Icon icon="plus" />
        </b-button>
        <b-button icon="refresh" variant="link" @click="refresh()">
          <Icon icon="refresh" />
        </b-button>
      </div>
    </div>
    <ContentLoader v-slot :loading="podcasts === null">
      <Tiles v-if="podcasts.length > 0" square>
        <Tile v-for="item in sortedItems" :key="item.id"
              :image="item.image"
              :to="{name: 'podcast', params: { id: item.id } }"
              :title="item.name">
          <template #text>
            <strong>{{ item.trackCount }}</strong> episodes
          </template>
        </Tile>
      </Tiles>
      <EmptyIndicator v-else-if="unsupported" label="Not supported" />
      <EmptyIndicator v-else />
    </ContentLoader>

    <AddPodcastModal :visible.sync="showAddModal" @confirm="add" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { usePodcastStore } from '@/library/podcast/store'
  import { orderBy } from 'lodash-es'
  import AddPodcastModal from '@/library/podcast/AddPodcastModal.vue'
  import { UnsupportedOperationError } from '@/shared/api'

  export default defineComponent({
    components: {
      AddPodcastModal,
    },
    props: {
      sort: { type: String, default: null },
    },
    setup() {
      const podcastStore = usePodcastStore()
      const { podcasts } = storeToRefs(podcastStore)
      return { podcasts, podcastStore }
    },
    data() {
      return {
        showAddModal: false,
        unsupported: false,
      }
    },
    computed: {
      sortedItems(): any[] {
        return this.sort === 'a-z'
          ? orderBy(this.podcasts, 'name')
          : orderBy(this.podcasts, 'updatedAt', 'desc')
      },
    },
    async created() {
      try {
        this.podcastStore.load()
      } catch (err) {
        if (err instanceof UnsupportedOperationError) {
          this.unsupported = true
          return
        }
        throw err
      }
    },
    methods: {
      async refresh() {
        try {
          await this.podcastStore.refresh()
        } catch (err) {
          console.log(err)
        }
      },
      async add(url: string) {
        try {
          await this.podcastStore.add(url)
        } catch (err) {
          console.log(err)
        }
      },
    }
  })
</script>
