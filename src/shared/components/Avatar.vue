<template functional>
  <span class="bg-secondary text-white rounded-circle avatar">
    <slot />
  </span>
</template>
<style scoped>
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    font-size: inherit;
    font-weight: 400;
    line-height: 1;
    max-width: 100%;
    max-height: auto;
    text-align: center;
    overflow: visible;
    position: relative;
  }
  .avatar > * {
    display: block;
  }
</style>
