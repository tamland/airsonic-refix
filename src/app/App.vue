<template>
  <div>
    <ErrorBar />
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import ErrorBar from './ErrorBar.vue'
  import Default from '@/app/layout/Default.vue'
  import Fullscreen from '@/app/layout/Fullscreen.vue'

  export default defineComponent({
    components: {
      ErrorBar,
      Default,
      Fullscreen,
    },
    computed: {
      layout(): string {
        return (this as any).$route.meta.layout || 'Default'
      }
    }
  })
</script>
