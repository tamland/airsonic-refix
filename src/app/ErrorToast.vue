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
  import { computed, defineComponent } from 'vue'
  import { useMainStore } from '@/shared/store'
  import { BToast } from 'bootstrap-vue'

  export default defineComponent({
    components: {
      BToast,
    },
    setup() {
      const store = useMainStore()
      return {
        error: computed(() => store.error),
        clearError: store.clearError,
      }
    },
  })
</script>
