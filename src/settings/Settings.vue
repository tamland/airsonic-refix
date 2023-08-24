<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="text-truncate">
        Settings
      </h1>
      <b-button variant="secondary" @click="settings.reset">
        Reset to defaults
      </b-button>
    </div>

    <b-card no-body>
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
          <b-col class="col-12 col-sm-6 col-xl-3 mb-3 mb-sm-0">
            <h5>Playlists in menu</h5>
            <b-form-checkbox :checked="settings.get('ui.menu.playlists')" @change="v => save('ui.menu.playlists')(v)">
              Yes, show it
            </b-form-checkbox>

            <h5 class="mt-3">Root component (/)</h5>
            <b-form-select variant="secondary" :value="settings.get('ui.root')" :options="settings.get('ui.menu.list')" @change="v => settings.set('ui.root', v)"/>
          </b-col>
          <b-col class="col-12 col-sm-6 col-xl-3 mb-3 mb-sm-0">
            <h5>Theme presets</h5>
            <b-form-select variant="secondary" :value="Object.keys(enums.themes).find(k => isEqual(enums.themes[k], settings.get('ui.theme')))" :options="Object.keys(enums.themes)" @change="v => settings.set('ui.theme', enums.themes[v])"/>

            <h5 class="mt-3">Customize theme</h5>
            <div v-for="v, k in { ...enums.theme_default, ...settings.get('ui.theme')}" :key="k" class="d-flex align-items-center justify-content-between mb-2">
              <label class="mr-2 mb-0">{{k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}}</label>
              <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
                <template #button-content>
                  <b-button :style="{backgroundColor: `${v}!important`, padding: '0px 10px'}">&nbsp;</b-button>
                </template>
                <chrome-picker :value="v" @input="v => settings.set(`ui.theme.${k}`, v?.hex8)"></chrome-picker>
              </b-dropdown>
            </div>
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
  import { BRow, BCol, BFormSelect, BFormInput } from 'bootstrap-vue'
  import { isEqual } from 'lodash-es'
  import { Chrome } from 'vue-color'

  export default defineComponent({
    components: {
      BRow,
      BCol,
      Sorter,
      BFormSelect,
      BFormInput,
      'chrome-picker': Chrome,
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
        isEqual
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
</style>
