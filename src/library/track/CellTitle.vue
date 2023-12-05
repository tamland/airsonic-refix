<template>
  <td>
    <slot>{{ track.title }}</slot>
    <div v-if="track.description" class="text-muted">
      <small>{{ track.description }}</small>
    </div>
    <div v-else-if="track.artists.length" class="d-lg-none text-muted">
      <small>{{ formatArtists(track.artists) }}</small>
    </div>
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { formatArtists } from '@/shared/utils'

  export default defineComponent({
    props: {
      track: { type: Object, required: true }
    },
    methods: {
      formatArtists
    }
  })
</script>
