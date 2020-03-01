<template>
  <div>
    <div class="min-vh-100 d-flex align-items-stretch justify-spcace-between">
      <div class="sidebar elevated d-none d-md-block" :class="{'d-block':showMenu}">
        <SideNav></SideNav>
      </div>
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
<style lang="scss" >
  .sidebar {
    // position: sticky;
    // top: 0;
    // height: calc(100vh - 80px);
    // width: 200px;
    // min-width: 200px;
    // max-width: 200px;
    // text-overflow: ellipsis;

    .nav-link {
      width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .main {
    margin-bottom: 80px;
  }
  .sidebar {
    padding-bottom: 180px;
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
  import SideNav from "./SideNav.vue";
  import TopNav from "./TopNav.vue";
  import Player from "@/player/Player.vue";
  import { mapState, mapMutations } from 'vuex';

  export default {
    components: {
      SideNav,
      TopNav,
      Player,
    },
    computed: {
      ...mapState(['showMenu'])
    },
  };
</script>
