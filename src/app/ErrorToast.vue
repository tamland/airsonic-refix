<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div class="toast" :class="{show: error != null}">
      <div class="toast-header ">
        <strong class="me-auto">Error</strong>
        <button
          type="button"
          class="btn btn-link text-danger-emphasis p-0"
          @click="clearError">
          <Icon icon="x" />
        </button>
      </div>
      <div v-if="error" class="toast-body">
        <strong>{{ error.message }}</strong>
        <div>{{ error.stack }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { useMainStore } from '@/shared/store'

  export default defineComponent({
    setup() {
      const store = useMainStore()
      return {
        error: computed(() => store.error),
        clearError: store.clearError,
      }
    },
  })
</script>
<style scoped>
  .toast {
    color: var(--bs-danger-text-emphasis) !important;
    background-color: var(--bs-danger-bg-subtle);

    .toast-header {
      color: var(--bs-danger-text-emphasis);
      border-color: var(--bs-danger-text-emphasis);
      background-color: var(--bs-danger-bg-subtle); ;
    }
  }
</style>
