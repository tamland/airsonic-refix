<template functional>
  <div class="tiles" :class="props.square ? 'tiles-square' : 'tiles-rect'">
    <slot />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      square: { type: Boolean, default: false },
    }
  })
</script>
<style lang="scss">
  .tiles {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  @media(max-width: 442px) { // 15px padding + 200px tile + 12px gap + 200px tile + 15px padding
    .tiles {
      grid-gap: 8px;
      grid-template-columns: repeat(2, minmax(1px, 1fr))
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
