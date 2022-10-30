<template>
  <td>
    <button>
      <Icon class="icon" :icon="$attrs.active ? 'pause' :'play'" />
      <span class="number">{{ $attrs.value || '-' }}</span>
    </button>
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
