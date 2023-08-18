<template>
  <nav class="nav flex-column">
    <div class="sidebar-brand d-flex justify-content-between align-items-end">
      <Logo />
      <button class="btn btn-link btn-lg p-0 m-0 d-md-none" @click="store.hideMenu">
        <Icon icon="x" />
      </button>
    </div>

    <router-link class="nav-link" :to="{name: 'discover'}" exact v-if="settings.includes('ui.menu.list', 'discover')">
      <Icon icon="discover" class="" /> Discover
    </router-link>

    <router-link class="nav-link" :to="{name: 'playing'}" v-if="settings.includes('ui.menu.list', 'playing')">
      <Icon icon="playlist" /> Playing
    </router-link>

    <small class="sidebar-heading text-muted">
      Library
    </small>

    <router-link class="nav-link" :to="{name: 'albums-default'}" v-if="settings.includes('ui.menu.list', 'albums')">
      <Icon icon="library" /> Albums
    </router-link>

    <router-link class="nav-link" :to="{name: 'artists'}" v-if="settings.includes('ui.menu.list', 'artists')">
      <Icon icon="library" /> Artists
    </router-link>

    <router-link class="nav-item nav-link" :to="{name: 'genres'}" v-if="settings.includes('ui.menu.list', 'genres')">
      <Icon icon="library" /> Genres
    </router-link>

    <router-link class="nav-link" :to="{name: 'playlists'}" v-if="settings.includes('ui.menu.list', 'playlists')">
      <Icon icon="list" /> Playlists
    </router-link>

    <router-link class="nav-link" :to="{name: 'favourites'}" v-if="settings.includes('ui.menu.list', 'favourites')">
      <Icon icon="heart" /> Favourites
    </router-link>

    <router-link class="nav-link" :to="{name: 'podcasts'}" v-if="settings.includes('ui.menu.list', 'podcasts')">
      <Icon icon="podcast" /> Podcasts
    </router-link>

    <router-link class="nav-link" :to="{name: 'radio'}" v-if="settings.includes('ui.menu.list', 'radio')">
      <Icon icon="radio" /> Radio
    </router-link>

    <PlaylistNav v-if="settings.get('ui.menu.playlists')"/>
  </nav>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import Logo from './Logo.vue'
  import PlaylistNav from '@/library/playlist/PlaylistNav.vue'
  import { useMainStore } from '@/shared/store'
  import { useSettingsStore } from '@/settings/store'

  export default defineComponent({
    components: {
      Logo,
      PlaylistNav,
    },
    setup() {
      return {
        settings: useSettingsStore(),
        store: useMainStore(),
      }
    },
  })
</script>
