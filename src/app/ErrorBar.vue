<template>
  <b-alert
    class="fixed-top m-0 rounded-0"
    variant="danger"
    :show="error != null"
    dismissible
    @dismissed="clearError">
    <template v-if="error">
      <strong>{{ error.message }}</strong><br>
      {{ error.stack }}
    </template>
  </b-alert>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    computed: {
      error(): any {
        return this.$store.state.error
      }
    },
    methods: {
      clearError() {
        return this.$store.commit('clearError')
      }
    },
  })
</script>
