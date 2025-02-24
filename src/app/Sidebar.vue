<template>
  <div class="sidebar-container elevated">
    <div class="sidebar-fixed d-none d-md-block">
      <SidebarNav />
    </div>
    <div
      class="offcanvas offcanvas-start d-md-none"
      tabindex="-1"
      :class="store.menuVisible ? 'showing': 'hiding'"
      @click="store.hideMenu"
    >
      <div class="offcanvas-body p-0">
        <SidebarNav />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import SidebarNav from './SidebarNav.vue'
  import { useMainStore } from '@/shared/store'

  export default defineComponent({
    components: {
      SidebarNav,
    },
    setup() {
      return {
        store: useMainStore(),
      }
    },
  })
</script>
<style>
  .sidebar-container .nav {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .sidebar-container .sidebar-fixed {
    padding-bottom: 100px;
    width: 250px;
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: scroll;
    scrollbar-width: none;
  }

  .sidebar-container .sidebar-fixed::-webkit-scrollbar {
    display: none;
  }

  .sidebar-container .sidebar-brand {
    padding: 1rem 1rem 0.75rem;
  }

  .sidebar-container .sidebar-heading {
    margin-top: 1.25em;
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

  .sidebar-container .nav-link:not(.active) .icon {
    color: var(--bs-secondary-color);
  }
  .sidebar-container .nav-link:hover {
    color: inherit;
    background-color: rgba(255, 255, 255, 0.045);
  }
  .sidebar-container .nav-link.active {
    color: var(--bs-primary);
    background-color: rgba(255, 255, 255, 0.045);
  }
  .sidebar-container .nav-link.active:hover {
    color: var(--bs-primary);
  }
</style>
