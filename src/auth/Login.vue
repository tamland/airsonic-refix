<template>
  <div class="d-flex align-items-center h-100 mt-5">
    <div v-if="!displayForm" class="mx-auto">
      <span class="spinner-border " />
    </div>
    <div v-else class="mx-auto card" style="width: 22rem">
      <fieldset :disabled="busy">
        <div class="card-body">
          <form @submit.prevent="login">
            <div class="d-flex mb-2">
              <Logo class="mx-auto" />
            </div>
            <div v-if="!config.serverUrl" class="mb-3">
              <label class="form-label">Server</label>
              <input v-model="server" name="server" type="text"
                     class="form-control" :class="{'is-invalid': hasError}">
            </div>
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" name="username" type="text"
                     class="form-control" :class="{'is-invalid': hasError}">
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" name="password" type="password"
                     class="form-control" :class="{'is-invalid': hasError}">
            </div>
            <div v-if="error != null" class="alert alert-danger">
              Could not log in. ({{ error.message }})
            </div>
            <button class="btn btn-primary w-100" @click="login">
              <span v-show="busy" class="spinner-border spinner-border-sm" /> Log in
            </button>
          </form>
        </div>
      </fieldset>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { config } from '@/shared/config'
  import Logo from '@/app/Logo.vue'
  import { useMainStore } from '@/shared/store'
  import { useAuth } from '@/auth/service'

  export default defineComponent({
    components: {
      Logo,
    },
    props: {
      returnTo: { type: String, required: true },
    },
    setup() {
      return {
        store: useMainStore(),
        auth: useAuth(),
      }
    },
    data() {
      return {
        server: '',
        username: '',
        password: '',
        busy: false,
        error: null,
        displayForm: false,
      }
    },
    computed: {
      hasError(): boolean {
        return this.error !== null
      },
      config: () => config
    },
    async created() {
      this.server = this.auth.server
      this.username = this.auth.username
      const success = await this.auth.autoLogin()
      if (success) {
        this.store.setLoginSuccess(this.username, this.server)
        await this.$router.replace(this.returnTo)
      } else {
        this.displayForm = true
      }
    },
    methods: {
      login() {
        this.error = null
        this.busy = true
        this.auth.loginWithPassword(this.server, this.username, this.password)
          .then(() => {
            this.store.setLoginSuccess(this.username, this.server)
            this.$router.replace(this.returnTo)
          })
          .catch(err => {
            this.error = err
          })
          .finally(() => {
            this.busy = false
          })
      }
    }
  })
</script>
