<template functional>
  <div :class="['tiles', props.square ? 'tiles-square' : 'tiles-rect', {'tiles-hs' : props.allowHScroll}]">
    <slot />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      square: { type: Boolean, default: false },
      allowHScroll: { type: Boolean, default: false },
    }
  })
</script>
<style lang="scss">
  .tiles {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(min(100% / 3, 200px), 1fr));
  }

  @media(max-width: 442px) { // 15px padding + 200px tile + 12px gap + 200px tile + 15px padding
    .tiles {
      grid-gap: 8px;
    }
  }

  // Enable horizontal scrolling before breaking to 2 columns
  @media(max-width: 654px) { // 15px padding + 200px tile + 12px gap + 200px tile + 12px gap + 200px tile + 15px padding
    .tiles-hs {
      grid-template-columns: none;
      grid-auto-flow: column;
      grid-auto-columns: minmax(min(100% / 2 - 1em, 200px), 1fr);
      overflow-x: auto;
    }
  }

  .tiles-square {
    .tile-img {
      padding-bottom: 100%;
    }
  }

  .tiles-rect {
    .tile-img {
      padding-bottom: 70%;
    }
  }
</style>
