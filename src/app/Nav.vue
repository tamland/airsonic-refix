<template>
  <div>
    <nav class="nav flex-column">
      <router-link class="nav-link logo" :to="{name: 'home'}">
        <Logo />
      </router-link>

      <router-link class="nav-link" :to="{name: 'home'}">
        <Icon icon="card-text" class="" /> Home
      </router-link>

      <router-link class="nav-link" :to="{name: 'queue'}">
        <Icon icon="music-note-list" /> Playing
      </router-link>

      <a class="nav-link disabled">
        <small class="text-uppercase text-muted font-weight-bold">
          Library
        </small>
      </a>

      <router-link class="nav-link" :to="{name: 'albums'}">
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

      <PlaylistNav />
    </nav>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import Logo from './Logo.vue'
  import PlaylistNav from '@/playlist/PlaylistNav.vue'

  export default Vue.extend({
    components: {
      Logo,
      PlaylistNav,
    },
    methods: {
      logout() {
        this.$auth.logout()
        this.$router.go(0)
      },
    }
  })
</script>
