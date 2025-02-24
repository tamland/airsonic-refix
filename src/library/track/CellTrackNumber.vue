<template>
  <td>
    <button>
      <Icon class="icon" :icon="$attrs.active ? 'pause' :'play'" />
      <span class="number">{{ $attrs.value || '-' }}</span>
    </button>
  </td>
</template>
