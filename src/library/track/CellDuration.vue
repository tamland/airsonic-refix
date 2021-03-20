<template functional>
  <td class="text-right d-none d-md-table-cell">
    <template v-if="props.track.duration">
      {{ parent.$formatDuration(props.track.duration) }}
    </template>
  </td>
</template>
