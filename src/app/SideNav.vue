<template>
  <div class="text-truncate">
    <nav class="nav flex-column">
      <router-link class="nav-link" :to="{name: 'home'}">
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

      
<!-- 
      <router-link class="nav-item nav-link" :to="{name: 'radio'}">
        <Icon>mdi-radio</Icon> Radio
      </router-link>

      <router-link class="nav-item nav-link" :to="{name: 'settings'}">
        <Icon>mdi-settings</Icon>Settings
      </router-link> -->
      <!-- <a href="#" class="nav-item nav-link" @click.prevent="logout">
        <Icon>mdi-</Icon> Logout
      </a> -->
    </nav>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import PlaylistNav from "@/playlist/PlaylistNav.vue";
import { mapState } from 'vuex';

export default Vue.extend({
  components: {
    PlaylistNav,
  },
  props: {
    show: Boolean
  },
  methods: {
    logout() {
      this.$auth.logout();
      this.$router.go(0);
    },
  }
});
</script>