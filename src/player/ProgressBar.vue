<template>
  <VueSlider
    v-bind="$attrs"
    :value="value"
    :min="0"
    :max="100"
    :interval="0.001"
    :lazy="true"
    :contained="true"
    :dot-options="{tooltip: 'none'}"
    @change="onInput"
  />
</template>
<script lang="ts">
  import Vue from 'vue'
  import VueSlider from 'vue-slider-component'

  export default Vue.extend({
    components: {
      VueSlider,
    },
    props: {
      value: { type: Number, required: true },
    },
    methods: {
      onInput(value: number) {
        this.$emit('input', value)
      },
    }
  })
</script>
<style lang="scss" scoped>
  @import '/src/style/variables';
  @import '~vue-slider-component/theme/material.css';

  .vue-slider {
    height: 4px !important;
    padding: 5px 0 !important;
    cursor: pointer;
  }
  ::v-deep .vue-slider-rail {
    background-color: $secondary;
    border-radius: 0;
  }
  ::v-deep .vue-slider-process {
    background-color: $primary;
    border-radius: 0;
  }
  ::v-deep .vue-slider-dot-handle  {
    background-color: $primary;
  }
  ::v-deep .vue-slider-dot-handle::after {
    background-color: rgba($primary, 0.32);
    transform: translate(-50%, -50%) scale(1);
  }
  .vue-slider:not(:hover) ::v-deep .vue-slider-dot-handle {
    display: none;
  }
  .vue-slider:hover ::v-deep .vue-slider-dot-handle {
    display: block;
  }
</style>
