<template>
  <div class="sidebar elevated">
    <div class="d-none d-md-block">
      <Nav/>
    </div>
    <b-sidebar
        :visible="showMenu"
        @hidden="toggleMenu"
        class="d-md-none"
        sidebar-class="elevated"
        bg-variant=""
        shadow="lg"
        no-header
        backdrop
        backdrop-variant=""
      >
      <Nav/>
    </b-sidebar>
  </div>
</template>
<style lang="scss" scoped>
  .sidebar {
    padding-bottom: 180px;
  }
</style>
<script lang="ts">
  import Vue from "vue";
  import Nav from "./Nav.vue";
  import { mapState, mapMutations } from 'vuex';

  export default Vue.extend({
    components: {
      Nav,
    },
    computed: {
      ...mapState(['showMenu'])
    },
    methods: {
      ...mapMutations(['toggleMenu']),
    },
  });
</script>