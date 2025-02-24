<template>
  <nav class="nav flex-column">
    <div class="sidebar-brand d-flex justify-content-between align-items-end">
      <Logo />
      <button class="btn btn-link btn-lg p-0 m-0 d-md-none" @click="store.hideMenu">
        <Icon icon="x" />
      </button>
    </div>

    <router-link class="nav-link" :to="{name: 'home'}" exact>
      <Icon icon="discover" class="" /> Discover
    </router-link>

    <router-link class="nav-link" :to="{name: 'queue'}">
      <Icon icon="soundwave" /> Playing
    </router-link>

    <small class="sidebar-heading text-muted">
      Library
    </small>

    <router-link class="nav-link" :to="{path: '/albums'}">
      <Icon icon="library" /> Albums
    </router-link>

    <router-link class="nav-link" :to="{path: '/artists'}">
      <Icon icon="library" /> Artists
    </router-link>

    <router-link class="nav-link" :to="{path: '/genres'}">
      <Icon icon="library" /> Genres
    </router-link>

    <router-link class="nav-link" :to="{path: '/playlists'}">
      <Icon icon="list" /> Playlists
    </router-link>

    <router-link class="nav-link" :to="{path: '/favourites'}">
      <Icon icon="heart" /> Favourites
    </router-link>

    <router-link class="nav-link" :to="{path: '/podcasts'}">
      <Icon icon="podcast" /> Podcasts
    </router-link>

    <router-link class="nav-link" :to="{path: '/radio'}">
      <Icon icon="radio" /> Radio
    </router-link>

    <router-link class="nav-link" :to="{path: '/files'}">
      <Icon icon="files" /> Files
    </router-link>

    <PlaylistNav />
  </nav>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import Logo from './Logo.vue'
  import PlaylistNav from '@/library/playlist/PlaylistNav.vue'
  import { useMainStore } from '@/shared/store'

  export default defineComponent({
    components: {
      Logo,
      PlaylistNav,
    },
    setup() {
      return {
        store: useMainStore(),
      }
    },
  })
</script>
