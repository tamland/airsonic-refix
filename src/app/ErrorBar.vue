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
  import { defineComponent } from '@vue/composition-api'
  import { mapState, mapMutations } from 'vuex'

  export default defineComponent({
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
