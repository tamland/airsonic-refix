<template>
  <div class="d-flex align-items-center mb-2">
    <button class="navbar-toggler text-primary d-md-none" @click="showMenu">
      <Icon icon="nav" />
    </button>

    <div class="ml-auto" />

    <SearchForm />

    <template v-if="username">
      <b-dropdown variant="link" right no-caret>
        <template #button-content>
          <b-avatar variant="primary">
            <Icon icon="person" />
          </b-avatar>
        </template>
        <b-dropdown-text>
          {{ username }}
        </b-dropdown-text>
        <b-dropdown-divider />
        <b-dropdown-item-button @click="scan">
          Scan media folders
        </b-dropdown-item-button>
        <b-dropdown-item-button @click="showAboutModal = true">
          About
        </b-dropdown-item-button>
        <b-dropdown-divider />
        <b-dropdown-item-button @click="logout">
          Log out
        </b-dropdown-item-button>
      </b-dropdown>
    </template>
    <About :visible="showAboutModal" @close="showAboutModal = false" />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapActions, mapState } from 'vuex'
  import About from './About.vue'
  import SearchForm from '@/search/SearchForm.vue'

  export default Vue.extend({
    components: {
      About,
      SearchForm,
    },
    data() {
      return {
        showAboutModal: false
      }
    },
    computed: {
      ...mapState([
        'server',
        'username',
      ]),
    },
    methods: {
      ...mapActions([
        'showMenu',
      ]),
      scan() {
        return this.$api.scan()
      },
      logout() {
        this.$auth.logout()
        this.$router.go(0)
      }
    }
  })
</script>
