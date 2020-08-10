<template functional>
  <div class="fixed-img bg-secondary">
    <div class="fixed-img-inner">
      <img v-if="props.src" :src="props.src">
      <div v-else class="text-muted">
        <Icon icon="music-note-beamed" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .fixed-img-sq {
    padding-bottom: 100%;
  }
  .fixed-img-rect {
    padding-bottom: 70%;
  }
  .fixed-img {
    position: relative;
    width: 100%;

    .tile-img-inner {
      position: absolute;
      width: 100%;
      height: 100%;

       img {

         width: 100%;
         height: 100%;
        object-fit: cover;
      }

      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4.5rem;
      }
    }
  }
</style>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      square: { type: Boolean, default: false },
    }
  })
</script>
