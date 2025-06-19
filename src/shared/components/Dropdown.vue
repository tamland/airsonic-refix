<template>
  <div ref="el" class="dropdown">
    <button
      type="button"
      :class="`btn btn-${variant} dropdown-toggle ${toggleClass}`"
      @click="toggle">
      <slot name="button-content" />
    </button>
    <ul
      v-if="visible"
      :class="['dropdown-menu', 'show', {'dropdown-menu-end': align === 'end' }]"
      @click="onClickInside"
    >
      <slot />
    </ul>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, } from 'vue'
  import { onClickOutside, useEventListener } from '@vueuse/core'

  export default defineComponent({
    props: {
      variant: { type: String, default: 'link' },
      align: { type: String, default: 'start' },
      toggleClass: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
    },
    setup() {
      const el = ref(null)
      const visible = ref(false)

      function toggle() {
        visible.value = !visible.value
      }

      function onClickInside(event: Event) {
        const target = event.target as (Element | null)
        if (target && ['A', 'BUTTON'].includes(target.tagName)) {
          visible.value = false
        }
      }

      onClickOutside(el, () => {
        visible.value = false
      })

      useEventListener(document, 'keyup', (event) => {
        if (event.key === 'Escape') {
          visible.value = false
        }
      })

      return {
        el,
        visible,
        toggle,
        onClickInside,
      }
    },
  })
</script>
<style scoped>
  .dropdown {
    display: inline-block;
  }
  .dropdown-menu-end {
    right: 0;
  }
  .dropdown-toggle::after {
    display: none;
  }
</style>
