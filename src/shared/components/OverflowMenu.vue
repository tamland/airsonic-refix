<template>
  <Dropdown
    align="end"
    :direction="direction"
    :variant="variant"
    :toggle-class="variant === 'link' ? 'p-0' : ''"
    :disabled="disabled"
  >
    <template #button-content>
      <Icon icon="three-dots-vertical" />
    </template>
    <slot />
  </Dropdown>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      disabled: { type: Boolean, default: false },
      variant: { type: String, default: 'link' },
      direction: { type: String, default: 'down' },
    }
  })
</script>
