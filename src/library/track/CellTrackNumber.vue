<template functional>
  <td>
    <button>
      <Icon class="icon" :icon="props.active ? 'pause' :'play'" />
      <span class="number">{{ props.value || '-' }}</span>
    </button>
  </td>
</template>
