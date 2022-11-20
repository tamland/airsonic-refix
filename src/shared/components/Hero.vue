<template>
  <div class="d-flex flex-nowrap mb-3 position-relative row">
    <div class="backdrop" />
    <div class="col-auto img-container">
      <img v-if="image" :src="image">
      <img v-else src="@/shared/assets/fallback.svg">
    </div>
    <div class="col pl-xl-4">
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
.img-container {
  max-width: 50%
}
.img-container img {
  width: 300px;
  height: auto;
  max-width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
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
