<template>
  <div>
    <div class="min-vh-100 d-flex -align-items-stretch -justify-spcace-between">
      <Sidebar />
      <main class="container-fluid pt-3 pb-3">
        <TopNav />
        <router-view />
      </main>
    </div>
    <ErrorBar />
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
  import ErrorBar from './ErrorBar.vue'
  import TopNav from './TopNav.vue'
  import Sidebar from './Sidebar.vue'
  import Player from '@/player/Player.vue'

  export default {
    components: {
      ErrorBar,
      TopNav,
      Sidebar,
      Player,
    },
  }
</script>
