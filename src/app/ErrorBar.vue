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
  import Vue from 'vue'
  import { mapState, mapMutations } from 'vuex'

  export default Vue.extend({
    computed: {
      ...mapState(['error'])
    },
    methods: {
      ...mapMutations([
        'clearError'
      ]),
    },
  })
</script>
