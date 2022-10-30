<template>
  <div>
    <div v-if="$attrs.loading" class="d-flex justify-content-center">
      <span class="spinner-border" />
    </div>
    <slot v-else />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
