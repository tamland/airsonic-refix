<template>
  <li>
    <component
      :is="href ? 'a' : 'button'"
      type="button"
      :href="href"
      :disabled="disabled"
      :class="[
        'dropdown-item d-flex justify-content-between align-items-center text-nowrap',
        {[`dropdown-item-${variant}`]: variant}
      ]"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot />
      <Icon v-if="icon" :icon="icon" class="ms-4" />
    </component>
  </li>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      icon: { type: String, default: null },
      variant: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      href: { type: String, default: null },
    }
  })
</script>
<style>
  .dropdown-item-danger:not(:disabled) {
    color: var(--bs-danger);
  }
</style>
