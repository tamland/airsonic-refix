<template>
  <td class="d-none d-lg-table-cell">
    <template v-if="$attrs.track.artistId">
      <router-link :to="{name: 'artist', params: {id: $attrs.track.artistId}}" @click.stop>
        {{ $attrs.track.artist }}
      </router-link>
    </template>
    <template v-else>
      {{ $attrs.track.artist }}
    </template>
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
