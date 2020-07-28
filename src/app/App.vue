<template>
  <div>
    <div class="min-vh-100 d-flex align-items-stretch justify-spcace-between">
      <Sidebar/>
      <div class="main flex-fill">
        <div class="container-fluid pt-3 pb-3">
          <TopNav/>
          <router-view></router-view>
        </div>
      </div>
    </div>
    <footer class="footer elevated">
      <Player />
    </footer>
  </div>
</template>
<style lang="scss">
  .main {
    margin-bottom: 80px;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
  }
</style>
<script lang="ts">
  import TopNav from "./TopNav.vue";
  import Sidebar from "./Sidebar.vue";
  import Player from "@/player/Player.vue";

  export default {
    components: {
      TopNav,
      Sidebar,
      Player,
    },
  };
</script>
