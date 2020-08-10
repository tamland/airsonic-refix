<template>
  <div class="text-truncate">
    <nav class="nav flex-column">
      <router-link class="nav-link logo" :to="{name: 'home'}">
        <Logo />
      </router-link>

      <router-link class="nav-link" :to="{name: 'home'}">
        <Icon icon="card-text" class="mr-2" /> Home
      </router-link>

      <router-link class="nav-link" :to="{name: 'queue'}">
        <Icon icon="music-note-list" class="mr-2" /> Playing
      </router-link>

      <router-link class="nav-link" :to="{name: 'starred'}">
        <Icon icon="star-fill" class="mr-2" /> Starred
      </router-link>

      <a class="nav-link disabled">
        <small class="text-uppercase text-muted font-weight-bold">
          Library
        </small>
      </a>

      <router-link class="nav-link" :to="{name: 'albums'}">
        <Icon icon="collection-fill" class="mr-2" /> Albums
      </router-link>

      <router-link class="nav-link" :to="{name: 'artists'}">
        <Icon icon="collection-fill" class="mr-2" /> Artists
      </router-link>

      <router-link class="nav-item nav-link" :to="{name: 'genres'}">
        <Icon icon="collection-fill" class="mr-2" /> Genres
      </router-link>

      <PlaylistNav />
    </nav>
  </div>
</template>
<style lang="scss" scoped>
  .logo {
    height: 48px;
  }
  .nav-link {
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
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
