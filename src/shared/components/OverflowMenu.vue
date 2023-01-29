<template>
  <b-dropdown
    no-caret
    boundary="window"
    :variant="variant"
    :toggle-class="variant === 'link' ? 'p-0' : 'px-1'"
    :disabled="disabled"
    lazy
  >
    <template #button-content>
      <Icon icon="three-dots-vertical" />
    </template>
    <slot />
  </b-dropdown>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      disabled: { type: Boolean, default: false },
      variant: { type: String, default: 'link' },
    }
  })
</script>
