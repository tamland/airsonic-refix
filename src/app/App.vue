<template>
  <div>
    <component :is="layout">
      <router-view />
    </component>
    <ErrorToast />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import ErrorToast from './ErrorToast.vue'
  import Default from '@/app/layout/Default.vue'
  import Fullscreen from '@/app/layout/Fullscreen.vue'
  import { useSettingsStore, Theme } from '@/settings/store'
  import { storeToRefs } from 'pinia'

  export default defineComponent({
    components: {
      ErrorToast,
      Default,
      Fullscreen,
    },
    setup() {
      const settingsStore = useSettingsStore()
      const { settings } = storeToRefs(settingsStore)
      return { settings, settingsStore }
    },
    async created() {
      this.setTheme(this.settingsStore.get('ui.theme'))
    },
    watch: {
      settings: {
        handler() {
          this.setTheme(this.settingsStore.get('ui.theme'))
        }
      }
    },
    computed: {
      layout(): string {
        return (this as any).$route.meta.layout || 'Default'
      }
    },
    methods: {
      setTheme: (theme: Theme) => {
        document.getElementById('client_theme')?.remove()
        const head = document.head || document.getElementsByTagName('head')[0]
        const style = document.createElement('style')
        style.setAttribute('type', 'text/css')
        style.setAttribute('id', 'client_theme')
        head.appendChild(style)
        style.appendChild(document.createTextNode(`:root {
          --primary: ${theme?.primary || '#09f'};
          --secondary: ${theme?.secondary || '#2e2e2e'};
          --text-body: ${theme?.text_body || '#ccc'};
          --text-muted: ${theme?.text_muted || '#999'};
          --background-0: ${theme?.background0 || '#000000'};
          --background-1: ${theme?.background1 || '#141414'};
          --background-2: ${theme?.background2 || '#2e2e2e'};
          --icons: ${theme?.icons || '#999'};
          --hover: ${theme?.hover || '#ffffff1a'};
          --text-btn: ${theme?.btn_text || '#fff'};
        }`))
      }
    },
  })
</script>
