<template>
  <td class="d-none d-md-table-cell">
    <template v-if="$attrs.track.albumId">
      <router-link :to="{name: 'album', params: {id: $attrs.track.albumId}}" @click.stop>
        {{ $attrs.track.album }}
      </router-link>
    </template>
    <template v-else>
      {{ $attrs.track.album }}
    </template>
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
