<template>
  <td>
    <slot>{{ $attrs.track.title }}</slot>
    <div v-if="$attrs.track.description" class="text-muted">
      <small>{{ $attrs.track.description }}</small>
    </div>
    <div v-else-if="$attrs.track.artist" class="d-lg-none text-muted">
      <small>{{ $attrs.track.artist }}</small>
    </div>
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
