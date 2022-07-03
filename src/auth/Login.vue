<template>
  <div class="row align-items-center h-100 mt-5">
    <div v-if="!displayForm" class="mx-auto">
      <span class="spinner-border " />
    </div>
    <div v-else class="mx-auto card " style="width: 22rem;">
      <b-overlay rounded :show="busy" opacity="0.1">
        <div class="card-body">
          <form @submit.prevent="login">
            <div class="d-flex mb-2">
              <Logo class="mx-auto" />
            </div>
            <div v-if="!config.serverUrl" class="form-group">
              <label>Server</label>
              <input v-model="server" name="server" type="text"
                     class="form-control" :class="{'is-invalid': hasError}">
            </div>
            <div class="form-group">
              <label>Username</label>
              <input v-model="username" name="username" type="text"
                     class="form-control" :class="{'is-invalid': hasError}">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input v-model="password" name="password" type="password"
                     class="form-control" :class="{'is-invalid': hasError}">
            </div>
            <b-alert :show="error != null" variant="danger">
              <template v-if="error != null">
                Could not log in. ({{ error.message }})
              </template>
            </b-alert>
            <button class="btn btn-primary btn-block" :disabled="busy" @click="login">
              <span v-show="false" class="spinner-border spinner-border-sm" /> Log in
            </button>
          </form>
        </div>
      </b-overlay>
    </div>
  </div>
</template>>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { config } from '@/shared/config'
  import Logo from '@/app/Logo.vue'

  export default defineComponent({
    components: {
      Logo,
    },
    props: {
      returnTo: { type: String, required: true },
    },
    data() {
      return {
        server: '',
        username: '',
        password: '',
        rememberLogin: true,
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
      this.server = this.$auth.server
      this.username = this.$auth.username
      const success = await this.$auth.autoLogin()
      if (success) {
        this.$store.commit('setLoginSuccess', {
          username: this.username,
          server: this.server,
        })
        this.$router.replace(this.returnTo)
      } else {
        this.displayForm = true
      }
    },
    methods: {
      login() {
        this.error = null
        this.busy = true
        this.$auth.loginWithPassword(this.server, this.username, this.password, this.rememberLogin)
          .then(() => {
            this.$store.commit('setLoginSuccess', {
              username: this.username,
              server: this.server,
            })
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
