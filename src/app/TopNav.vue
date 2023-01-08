<template>
  <div class="d-flex align-items-center mb-2">
    <button class="navbar-toggler text-white d-md-none" @click="store.showMenu">
      <Icon icon="nav" />
    </button>

    <div class="ml-auto" />

    <SearchForm />

    <template v-if="store.username">
      <b-dropdown variant="link" right no-caret>
        <template #button-content>
          <Avatar>
            <Icon icon="person" />
          </Avatar>
        </template>
        <b-dropdown-text>
          {{ store.server }}
        </b-dropdown-text>
        <b-dropdown-text>
          {{ store.username }}
        </b-dropdown-text>
        <b-dropdown-divider />
        <b-dropdown-item :href="`${store.server}/settings.view`" target="_blank">
          Server settings
        </b-dropdown-item>
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
  import { defineComponent } from 'vue'
  import About from './About.vue'
  import SearchForm from '@/search/SearchForm.vue'
  import { useMainStore } from '@/shared/store'
  import { useAuth } from '@/auth/service'

  export default defineComponent({
    components: {
      About,
      SearchForm,
    },
    setup() {
      return {
        store: useMainStore(),
        auth: useAuth(),
      }
    },
    data() {
      return {
        showAboutModal: false
      }
    },
    methods: {
      scan() {
        return this.$api.scan()
      },
      logout() {
        this.auth.logout()
        this.$router.go(0)
      }
    }
  })
</script>
