<template>
  <div class="d-flex align-items-center mb-2">
    <button class="navbar-toggler text-white d-md-none" @click="toggleMenu">
      <Icon icon="list"/>
    </button>

    <div class="ml-auto"></div>

    <SearchForm/>

    <template v-if="username">
      <b-dropdown variant="link" right no-caret>
        <template #button-content>
          <b-avatar variant="secondary">
            <Icon icon="person-fill"/>
          </b-avatar>
        </template>
        <b-dropdown-text>
          {{ server }}
        </b-dropdown-text>
        <b-dropdown-text>
          {{ username }}
        </b-dropdown-text>
        <b-dropdown-divider/>
        <b-dropdown-item-button @click="logout">
          Log out
        </b-dropdown-item-button>
      </b-dropdown>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapMutations, mapState } from 'vuex';
import SearchForm from '@/search/SearchForm.vue';

  export default Vue.extend({
    components: {
      SearchForm,
    },
    computed: {
      ...mapState([
        "server",
        "username",
      ])
    },
    methods: {
      ...mapMutations([
        'toggleMenu',
      ]),
      logout() {
        this.$auth.logout();
        this.$router.go(0);
      }
    }
  });
</script>