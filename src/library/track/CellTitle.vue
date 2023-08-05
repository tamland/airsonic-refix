<template functional>
  <td>
    <slot>{{ props.track.name || props.track.title }}</slot>
    <div v-if="props.track.description" class="text-muted">
      <small>{{ props.track.description }}</small>
    </div>
    <div v-else-if="props.track.artist" class="d-lg-none text-muted">
      <small>{{ props.track.artist }}</small>
    </div>
  </td>
</template>
