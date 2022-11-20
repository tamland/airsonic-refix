<template>
  <div class="row flex-nowrap d-flex mb-3 position-relative row">
    <div class="backdrop" />
    <div class="+mr-3 pr-xl-4 image-container col-auto ">
      <img v-if="image" class="img-fluid" height="300" width="300" :src="image">
      <img v-else class="img-fluid" height="300" width="300" src="@/shared/assets/fallback.svg">
    </div>
    <div class="col">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import fallbackImage from '@/shared/assets/fallback.svg'

  export default defineComponent({
    props: {
      image: { type: String, default: null },
    },
    computed: {
      backgroundImage(): string {
        return `url('${this.image || fallbackImage}')`
      }
    },
  })
</script>
<style scoped>
.image-container {
  max-width: 50%;
}
.backdrop {
  position: absolute;
  z-index: -1;
  width: 100%;
  top: -50%;
  height: calc(100% + 300px);

  transform: scale(1.025);
  filter: blur(8px);
  opacity: 0.25;

  background-size: max(100%, 1000px) auto;
  background-position: center center;
  background-repeat: no-repeat;

  background-image:
    linear-gradient(to bottom, transparent, black),
    v-bind(backgroundImage);
}
</style>
