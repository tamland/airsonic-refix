<template>
  <div>
    <div v-if="$attrs.loading" class="d-flex justify-content-center">
      <span class="spinner-border" />
    </div>
    <slot v-else />
  </div>
</template>
