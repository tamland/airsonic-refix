<template>
  <div class="sidebar-container elevated">
    <div class="sidebar-fixed d-none d-md-block">
      <Nav />
    </div>
    <b-sidebar
      :visible="showMenu"
      class="d-md-none"
      sidebar-class="elevated"
      bg-variant=""
      shadow="lg"
      no-header
      backdrop
      backdrop-variant=""
      @hidden="hideMenu"
    >
      <Nav />
    </b-sidebar>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from '@vue/composition-api'
  import Nav from './Nav.vue'

  export default defineComponent({
    components: {
      Nav,
    },
    computed: {
      showMenu() {
        return this.$store.state.showMenu
      }
    },
    methods: {
      hideMenu() {
        return this.$store.dispatch('hideMenu')
      }
    },
  })
</script>
<style>
  .sidebar-container .sidebar-fixed {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 180px;
    width: 250px;
  }

  .sidebar-container .sidebar-brand {
    padding: 1rem 1rem 0.75rem;
  }

  .sidebar-container .sidebar-heading {
    padding: 0.5rem 1rem;
    font-weight: bold;
    text-transform: uppercase;
    display: block;
  }

  .sidebar-container .nav-link {
    width: calc(100%);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sidebar-container a.nav-link .icon {
    margin-right: 0.75rem;
  }

  .sidebar-container .nav-link:not(.router-link-active) .icon {
    color: var(--text-muted);
  }
  .sidebar-container .nav-link:hover {
    color: inherit;
    background-color: rgba(255, 255, 255, 0.045);
  }
  .sidebar-container .nav-link.router-link-active {
    color: var(--primary);
    background-color: rgba(255, 255, 255, 0.045);
  }
  .sidebar-container .nav-link.router-link-active:hover {
    color: var(--primary);
  }
</style>
