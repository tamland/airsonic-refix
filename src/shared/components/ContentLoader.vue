<template functional>
  <div>
    <div v-if="props.loading" class="d-flex justify-content-center">
      <span class="spinner-border" />
    </div>
    <slot v-else />
  </div>
</template>
