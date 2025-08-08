<template>
  <div ref="el" class="d-flex justify-content-center my-4">
    <span v-show="loading" class="spinner-border" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useIntersectionObserver } from '@vueuse/core'

  function isInViewport(el: HTMLElement | null) {
    if (!el) {
      return false
    }
    const rect = el.getBoundingClientRect()
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  export default defineComponent({
    props: {
      loading: { type: Boolean, required: true },
      hasMore: { type: Boolean, required: true },
    },
    emits: ['load-more'],
    setup(props, { emit }) {
      const el = ref<HTMLElement | null>(null)

      function check() {
        if (isInViewport(el.value) && !props.loading && props.hasMore) {
          emit('load-more')
        }
      }

      const { stop } = useIntersectionObserver(el, () => {
        check()
      })

      watch([props], () => {
        check()
      })

      onMounted(() => {
        emit('load-more')
      })

      onBeforeUnmount(() => {
        stop()
      })
      return { el }
    },
  })
</script>
