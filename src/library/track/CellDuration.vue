<template>
  <td class="text-end d-none d-md-table-cell">
    {{ duration }}
  </td>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { formatDuration } from '@/shared/utils'

  export default defineComponent({
    props: {
      track: { type: Object, required: true }
    },
    setup(props) {
      return {
        duration: props.track.duration ? formatDuration(props.track.duration) : ''
      }
    }
  })
</script>
