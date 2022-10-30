<template>
  <td class="text-right d-none d-md-table-cell">
    <template v-if="$attrs.track.duration">
      {{ $formatDuration($attrs.track.duration) }}
    </template>
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
