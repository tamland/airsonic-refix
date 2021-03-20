<template functional>
  <td>
    <button>
      <Icon class="icon" :icon="props.active ? 'pause-fill' :'play-fill'" />
      <span class="number">{{ props.track.track || 1 }}</span>
    </button>
  </td>
</template>
