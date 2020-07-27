<template>
  <div>
    <b-modal title="Login" hide-footer no-close-on-esc :visible="showModal">
      <form @submit.prevent="login">
        <fieldset :disabled="busy">
          <b-form-group label="Server">
            <b-form-input name="server" type="text" v-model="server" required></b-form-input>
          </b-form-group>
          <b-form-group label="Username">
            <b-form-input name="username" type="text" v-model="username" required></b-form-input>
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input name="password" type="password" v-model="password" required></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-checkbox v-model="rememberLogin">Remember</b-form-checkbox>
          </b-form-group>
          <b-alert :show="!!error" variant="danger">
            Login failed.
          </b-alert>
          <button class="btn btn-primary" @click="login">
            <b-spinner v-show="busy" small type="grow"/>
            Login
          </button>
        </fieldset>
      </form>
    </b-modal>
  </div>
</template>>
<script lang="ts">
import Vue from "vue";
import { mapMutations, mapState } from "vuex";

export default Vue.extend({
  props: {
    returnTo: { type: String, required: true },
  },
  data() {
    return {
      server: "",
      username: "",
      password: "",
      rememberLogin: false,
      busy: false,
      error: false,
      showModal: false,
    };
  },
  async created() {
    this.server = await this.$auth.server;
    this.username = await this.$auth.username;
    const success = await this.$auth.autoLogin();
    if (success) {
      this.$store.commit("setLoginSuccess", { username: this.username});
      this.$router.push(this.returnTo);
    } else {
      this.showModal = true;
    }
  },
  methods: {
    login() {
      this.busy = true;
      this.$auth.loginWithPassword(this.server, this.username, this.password, this.rememberLogin)
        .then(() => {
          this.$store.commit("setLoginSuccess", { username: this.username });
          this.$router.push(this.returnTo);
        })
        .catch(err => {
          this.error = true;
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
});
</script>
