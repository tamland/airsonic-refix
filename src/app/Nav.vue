<template>
  <nav class="nav flex-column">
    <div class="logo d-flex justify-content-between">
      <Logo />
      <button class="btn btn-link btn-lg p-0 d-md-none" @click="hideMenu">
        <Icon icon="x" />
      </button>
    </div>

    <router-link class="nav-link" :to="{name: 'home'}" exact>
      <Icon icon="card-text" class="" /> Discover
    </router-link>

    <router-link class="nav-link" :to="{name: 'queue'}">
      <Icon icon="music-note-list" /> Playing
    </router-link>

    <small class="sidebar-heading text-muted">
      Library
    </small>

    <router-link class="nav-link" :to="{name: 'albums-default'}">
      <Icon icon="collection" /> Albums
    </router-link>

    <router-link class="nav-link" :to="{name: 'artists'}">
      <Icon icon="collection" /> Artists
    </router-link>

    <router-link class="nav-item nav-link" :to="{name: 'genres'}">
      <Icon icon="collection" /> Genres
    </router-link>

    <router-link class="nav-link" :to="{name: 'starred'}">
      <Icon icon="star" /> Starred
    </router-link>

    <router-link class="nav-link" :to="{name: 'podcasts'}">
      <Icon icon="rss" /> Podcasts
    </router-link>

    <router-link class="nav-link" :to="{name: 'radio'}">
      <Icon icon="broadcast" /> Radio
    </router-link>

    <PlaylistNav />
  </nav>
</template>
<script lang="ts">
  import Vue from 'vue'
  import Logo from './Logo.vue'
  import PlaylistNav from '@/playlist/PlaylistNav.vue'
  import { mapActions } from 'vuex'

  export default Vue.extend({
    components: {
      Logo,
      PlaylistNav,
    },
    methods: {
      ...mapActions(['hideMenu']),
    },
  })
</script>
