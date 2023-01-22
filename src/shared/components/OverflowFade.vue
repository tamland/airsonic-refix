<template>
  <div ref="el" class="el" @scroll="updateScrollPosition">
    <slot />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, onUnmounted, Ref, ref } from 'vue'

  export default defineComponent({
    setup() {
      const el = ref(null) as unknown as Ref<HTMLElement>
      const isScrolledToTop = ref(true)
      const isScrolledToBottom = ref(true)

      function updateScrollPosition() {
        isScrolledToBottom.value = el.value.scrollHeight - el.value.scrollTop - el.value.clientHeight < 1
        isScrolledToTop.value = el.value.scrollTop < 1
      }

      const maskTop = computed(() => isScrolledToTop.value ? '0' : '2em')
      const maskBottom = computed(() => isScrolledToBottom.value ? '0' : '2em')

      const resizeObserver = new ResizeObserver(() => {
        updateScrollPosition()
      })

      onMounted(() => {
        resizeObserver.observe(el.value)
      })
      onUnmounted(() => {
        resizeObserver.disconnect()
      })

      return {
        el,
        updateScrollPosition,
        maskTop,
        maskBottom,
      }
    },
  })
</script>
<style scoped>
  .el {
    mask-image:
      linear-gradient(to bottom, transparent 0, black v-bind(maskTop)),
      linear-gradient(to top, transparent 0, black v-bind(maskBottom));
    mask-composite: intersect;
    overflow-y: scroll;
    min-height: 0;
  }
  .el {
    scrollbar-width: none;
  }
  .el::-webkit-scrollbar {
    display: none;
  }
</style>
