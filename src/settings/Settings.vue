<template>
  <div>
    <div class="d-flex align-items-center mb-2">
      <h1 class="mb-3 mr-2 text-truncate">
        Settings
      </h1>
    </div>

    <b-card no-body bg-variant="secondary" text-variant="white">
      <b-card-header @click="sectionToggle('ui')">
        User Interface
        <Icon :icon="sectionIsShow('ui') ? 'minus' : 'plus'" class="float-right" />
      </b-card-header>
      <b-card-body v-show="sectionIsShow('ui')">
        <b-row>
          <b-col class="col-12 col-sm-6 col-xl-3 mb-3 mb-sm-0">
            <h5>Menu elements</h5>
            <Sorter :list="settings.get('ui.menu.list')" :options="enums.menu" :save="save('ui.menu.list')" />
          </b-col>
          <b-col class="col-12 col-sm-6 col-xl-3">
            <h5>Playlists in menu</h5>
            <b-form-checkbox :checked="settings.get('ui.menu.playlists')" @change="v => save('ui.menu.playlists')(v)" class="custom_control">
              Yes, show it
            </b-form-checkbox>

            <h5 class="mt-3">Root component (/)</h5>
            <b-form-select variant="secondary" :value="settings.get('ui.root')" :options="settings.get('ui.menu.list')" @change="v => settings.set('ui.root', v)"/>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Sorter from './Sorter.vue'
  import { useSettingsStore, enums } from '@/settings/store'
  import { BRow, BCol, BFormSelect } from 'bootstrap-vue'

  export default defineComponent({
    components: {
      BRow,
      BCol,
      Sorter,
      BFormSelect,
    },
    setup() {
      return { settings: useSettingsStore() }
    },
    data() {
      return {
        section: {
          ui: true
        } as any,
        enums,
      }
    },
    methods: {
      sectionToggle(id: string) {
        this.section = { ...this.section, [id]: !this.section[id] }
      },
      sectionIsShow(id: string) {
        return this.section[id]
      },
      save(path: string) {
        return (value: any) => {
          this.settings.set(path, value)
        }
      }
    }
  })
</script>

<style scoped>
  .custom-control {
    z-index: unset!important;
  }
  .custom-select  {
    border: 1px #727272 solid!important;
  }
</style>
