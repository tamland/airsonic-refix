<template>
  <div @contextmenu="showContextMenu">
    <slot />
    <b-dropdown
      v-if="$slots['context-menu']"
      ref="dropdown" toggle-class="p-0 border-0" no-caret lazy
      :style="{position: 'absolute', left: `${left}px`,top: `${top}px`}"
      @hide="hide"
    >
      <slot name="context-menu" />
    </b-dropdown>
  </div>
</template>
<script lang="ts">
  import Vue, { defineComponent } from 'vue'

  export default defineComponent({
    data() {
      return {
        top: 0,
        left: 0,
        visible: false,
      }
    },
    watch: {
      visible: {
        handler(value: boolean) {
          Vue.set((this.$refs.dropdown as any), 'visible', value)
        }
      }
    },
    methods: {
      hide(event: any) {
        event.preventDefault()
        this.visible = false
      },
      showContextMenu(event: any) {
        if (this.$slots['context-menu']) {
          event.preventDefault()
          this.top = event.offsetY
          this.left = event.offsetX
          this.visible = true
        }
      }
    }
  })
</script>
