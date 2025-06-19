<template>
  <div class="d-flex align-items-center mb-2">
    <button class="btn navbar-toggler text-white d-md-none me-2" @click="store.showMenu">
      <Icon icon="nav" />
    </button>

    <SearchForm class="flex-grow-1 flex-md-grow-0 ms-auto me-2" />

    <template v-if="store.username">
      <Dropdown variant="link" align="end" no-caret toggle-class="px-0">
        <template #button-content>
          <Avatar>
            <Icon icon="person" />
          </Avatar>
        </template>
        <div class="px-3 py-1">
          {{ store.username }}
        </div>
        <hr class="dropdown-divider">
        <DropdownItem :href="store.server" target="_blank" rel="noopener noreferrer">
          Server <Icon icon="link" />
        </DropdownItem>
        <DropdownItem @click="scan">
          Scan media folders
        </DropdownItem>
        <DropdownItem @click="showAboutModal = true">
          About
        </DropdownItem>
        <hr class="dropdown-divider">
        <DropdownItem @click="logout">
          Log out
        </DropdownItem>
      </Dropdown>
    </template>
    <About :visible="showAboutModal" @close="showAboutModal = false" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import About from './About.vue'
  import SearchForm from '@/library/search/SearchForm.vue'
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
