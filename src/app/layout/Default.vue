<template>
  <div>
    <div class="min-vh-100 d-flex">
      <Sidebar />
      <main class="container-fluid py-2">
        <TopNav />
        <slot />
      </main>
    </div>
    <Player />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import TopNav from '@/app/TopNav.vue'
  import Sidebar from '@/app/Sidebar.vue'
  import Player from '@/player/Player.vue'

  export default defineComponent({
    components: {
      TopNav,
      Sidebar,
      Player,
    },
  })
</script>
<style lang="scss">
  main {
    margin-bottom: 80px;
    overflow-x: hidden;
  }
</style>
