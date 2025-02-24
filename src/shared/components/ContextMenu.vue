<template>
  <div @contextmenu="showContextMenu">
    <slot />
    <b-dropdown
      v-if="$slots['context-menu']"
      ref="dropdown"
      v-model="visible"
      toggle-class="p-0 border-0" no-caret lazy
      :style="{position: 'absolute', left: `${left}px`,top: `${top}px`}"
    >
      <slot name="context-menu" />
    </b-dropdown>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    data() {
      return {
        top: 0,
        left: 0,
        visible: false,
      }
    },
    methods: {
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
