<template>
  <div>
    <div class="min-vh-100 d-flex">
      <Sidebar />
      <main class="container-fluid pt-3 pb-3">
        <TopNav />
        <slot />
      </main>
    </div>
    <Player />
  </div>
</template>
<style lang="scss">
  main {
    margin-bottom: 80px;
    overflow-x: hidden;
  }
</style>
<script lang="ts">
  import TopNav from '@/app/TopNav.vue'
  import Sidebar from '@/app/Sidebar.vue'
  import Player from '@/player/Player.vue'

  export default {
    components: {
      TopNav,
      Sidebar,
      Player,
    },
  }
</script>
