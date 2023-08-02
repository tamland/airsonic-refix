<template>
  <ContentLoader v-slot :loading="items === null">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0 mr-2 text-truncate">
        Radio
      </h1>
        <b-button variant="link" :disabled="unsupported" @click="editRadioStation()">
          <Icon icon="plus" />
        </b-button>
    </div>

    <TrackList v-if="items.length > 0" :tracks="items" no-artist no-album no-duration homepageUrl>
      <template #context-menu="{index}">
        <b-dropdown-divider />
        <ContextMenuItem icon="edit" @click="editRadioStation(index)">
          Edit
        </ContextMenuItem>
        <ContextMenuItem icon="trash" variant="danger" @click="deleteRadioStation(index)">
          Delete
        </ContextMenuItem>
      </template>
    </TrackList>
    <EmptyIndicator v-else-if="unsupported" label="Not supported" />
    <EmptyIndicator v-else />
    <EditModal :visible.sync="showEditModal" :item="editItem" @confirm="updateStation">
      <template #title="{item}">
        {{ item?.id ? "Edit" : "Add" }} Radio Station
      </template>
      <template #default="{ item }">
        <div class="form-group">
          <label>Name *</label>
          <input v-model="item.title" class="form-control" type="text" />
        </div>
        <div class="form-group">
          <label>Stream URL *</label>
          <input v-model="item.url" class="form-control" type="text" />
        </div>
        <div class="form-group">
          <label class="mb-0">Home Page URL</label>
          <input v-model="item.homepageUrl" class="form-control" type="text" />
        </div>
      </template>
    </EditModal>
  </ContentLoader>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { storeToRefs } from 'pinia'
  import { UnsupportedOperationError } from '@/shared/api'
  import ContentLoader from '@/shared/components/ContentLoader.vue'
  import EditModal from '@/shared/components/EditModal.vue'
  import TrackList from '@/library/track/TrackList.vue'
  import { useRadioStore } from '@/library/radio/store'
  import { useMainStore } from '@/shared/store'

  export default defineComponent({
    components: {
      TrackList,
      ContentLoader,
      EditModal,
    },
    setup() {
      const radioStore = useRadioStore()
      const { setError } = useMainStore()
      const { items } = storeToRefs(radioStore)
      return { items, setError, radioStore }
    },
    data() {
      return {
        unsupported: false,
        showEditModal: false,
        editItem: {},
      }
    },
    async created() {
      this.radioStore.load().catch(err => {
        if (err instanceof UnsupportedOperationError) {
          this.unsupported = true
          return
        }
        this.setError(err)
      })
    },
    methods: {
      editRadioStation(index: number) {
        this.editItem = this.items && this.items[index] ? this.items[index] : {}
        this.showEditModal = true
      },
      deleteRadioStation(index: number) {
        if (this.items) {
          this.radioStore.delete(this.items[index].id)
        }
      },
      updateStation(value: any) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

        if (!value.title) {
          this.setError({ name: 'Radio Station Name', message: 'Radio Station Name is required' })
          return
        }
        if (!value.url) {
          this.setError({ name: 'Radio Station Stream URL', message: 'Radio Station Stream URL is required' })
          return
        }
        if (!pattern.test(value.url)) {
          this.setError({ name: 'Radio Station Stream URL', message: 'Radio Station Stream URL is not valid' })
          return
        }
        if (!!value.homepageUrl && !pattern.test(value.homepageUrl)) {
          this.setError({ name: 'Radio Station Home Page URL', message: 'Radio Station Home Page URL is not valid' })
          return
        }

        if (value?.id) {
          this.radioStore.update(value)
          this.editItem = {}
          return
        }

        this.radioStore.create(value?.title, value?.url, value?.homeURL || '')
        this.editItem = {}
      },
    },
  })
</script>
