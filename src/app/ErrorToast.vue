<template>
  <b-toast
    v-if="error"
    visible
    title="Error"
    variant="danger"
    solid
    no-fade
    no-auto-hide
    @change="clearError"
  >
    <template v-if="error">
      <strong>{{ error.message }}</strong>
      <div>{{ error.stack }}</div>
    </template>
  </b-toast>
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
