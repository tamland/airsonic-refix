<template>
  <div class="d-flex flex-column align-items-center pt-5">
    <Icon icon="stack" class="empty-icon" />
    <div class="mt-4 text-muted">
      <slot>
        {{ $attrs.label || 'Empty' }}
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
<style scoped>
  .empty-icon{
    font-size: 8em;
    color: #222
  }
</style>
