<template>
  <div>
    <b-modal size="sm" hide-header hide-footer no-close-on-esc :visible="showModal">
      <form @submit.prevent="login">
        <div style="font-size: 4rem; color: #fff;" class="text-center">
          <Icon icon="person-circle"/>
        </div>
        <b-form-group label="Server">
          <b-form-input name="server" type="text" v-model="server" :state="valid"/>
        </b-form-group>
        <b-form-group label="Username">
          <b-form-input name="username" type="text" v-model="username" :state="valid"/>
        </b-form-group>
        <b-form-group label="Password">
          <b-form-input name="password" type="password" v-model="password" :state="valid"/>
        </b-form-group>
        <b-alert :show="error != null" variant="danger">
          <template v-if="error != null">
            Could not log in. ({{ error.message }})
          </template>
        </b-alert>
        <button class="btn btn-primary btn-block" @click="login" :disabled="busy">
          <b-spinner v-show="busy" small type="grow"/> Log in
        </button>
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
      rememberLogin: true,
      busy: false,
      error: null,
      showModal: false,
    };
  },
  async created() {
    this.server = await this.$auth.server;
    this.username = await this.$auth.username;
    const success = await this.$auth.autoLogin();
    if (success) {
      this.$store.commit("setLoginSuccess", {
        username: this.username,
        server: this.server,
      });
      this.$router.replace(this.returnTo);
    } else {
      this.showModal = true;
    }
  },
  computed: {
    valid(): false | null {
      return this.error == null ? null : false
    }
  },
  methods: {
    login() {
      this.error = null;
      this.busy = true;
      this.$auth.loginWithPassword(this.server, this.username, this.password, this.rememberLogin)
        .then(() => {
          this.$store.commit("setLoginSuccess", {
            username: this.username,
            server: this.server,
          });
          this.$router.replace(this.returnTo);
        })
        .catch(err => {
          this.error = err;
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
});
</script>
