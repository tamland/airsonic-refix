<template>
  <div class="row align-items-center h-100 mt-5">
    <div v-if="!displayForm" class="mx-auto">
      <span class="spinner-border " />
    </div>
    <div v-else class="mx-auto card " style="width: 22rem;">
      <b-overlay rounded :show="busy" opacity="0.1">
        <div class="card-body">
          <form @submit.prevent="login">
            <div style="width: 160px;" class="d-flex mx-auto mb-2">
              <Logo />
            </div>
            <b-form-group v-if="!config.serverUrl" label="Server">
              <b-form-input v-model="server" name="server" type="text" :state="valid" />
            </b-form-group>
            <b-form-group label="Username">
              <b-form-input v-model="username" name="username" type="text" :state="valid" />
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input v-model="password" name="password" type="password" :state="valid" />
            </b-form-group>
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
  import Vue from 'vue'
  import { config } from '@/shared/config'
  import Logo from '@/app/Logo.vue'

  export default Vue.extend({
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
      valid(): false | null {
        return this.error == null ? null : false
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
