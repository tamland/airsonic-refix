<template>
  <div ref="el">
    <slot />
    <ul
      v-if="enabled && visible"
      :class="['dropdown-menu', 'position-absolute', 'show']"
      :style="{ left: `${position.left}px`,top: `${position.top}px` }"
    >
      <slot name="context-menu" />
    </ul>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, } from 'vue'
  import { useEventListener } from '@vueuse/core'

  export default defineComponent({
    props: {
      enabled: { type: Boolean, default: true },
    },
    setup(props) {
      const el = ref<Element | null>(null)
      const visible = ref(false)
      const position = ref({ top: 0, left: 0 })

      useEventListener(document, 'contextmenu', (event) => {
        if (
          props.enabled &&
          el.value &&
          event.target &&
          (event.target === el.value || el.value.contains(event.target as Element))
        ) {
          event.preventDefault()
          position.value = { top: event.offsetY, left: event.offsetX }
          visible.value = true
        } else {
          visible.value = false
        }
      })

      useEventListener(document, 'click', () => {
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
        position,
      }
    },
  })
</script>
