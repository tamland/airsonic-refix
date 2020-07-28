<template>
  <div class="text-truncate">
    <nav class="nav flex-column">
      <router-link class="nav-link logo" :to="{name: 'home'}">
        <img src="@/app/logo.png" class="img-fluid">
      </router-link>

      <router-link class="nav-link" :to="{name: 'home'}">
        <Icon>mdi-home</Icon> Home
      </router-link>

      <router-link class="nav-link" :to="{name: 'queue'}">
        <Icon>mdi-view-list</Icon> Playing
      </router-link>

      <router-link class="nav-link" :to="{name: 'starred'}">
        <Icon>mdi-star</Icon> Starred
      </router-link>
      
      <a class="nav-link disabled">
        <small class="text-uppercase text-muted font-weight-bold">
          Library
        </small>
      </a>

      <router-link class="nav-link" :to="{name: 'albums'}">
        <Icon>mdi-album</Icon> Albums
      </router-link>

      <router-link class="nav-link" :to="{name: 'artists'}">
        <Icon>mdi-artist</Icon> Artists
      </router-link>

      <router-link class="nav-item nav-link" :to="{name: 'genres'}">
        <Icon>mdi-library-music</Icon> Genres
      </router-link>

      <PlaylistNav/>
    </nav>
  </div>
</template>
<style lang="scss" scoped>
  .logo {
    max-width: 200px;
  }
  .nav-link {
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<script lang="ts">
import Vue from "vue";
import PlaylistNav from "@/playlist/PlaylistNav.vue";
import { mapState } from 'vuex';

export default Vue.extend({
  components: {
    PlaylistNav,
  },
  methods: {
    logout() {
      this.$auth.logout();
      this.$router.go(0);
    },
  }
});
</script>