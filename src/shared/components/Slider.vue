<template>
  <VueSlider
    v-bind="$attrs"
    :value="value"
    :min="min"
    :max="max"
    :interval="step"
    :tooltip-formatter="formatter"
    @change="onInput"
  />
</template>
<style>
  @import '~vue-slider-component/theme/default.css';
  .vue-slider-rail {
    background-color: var(--secondary) !important;
  }
  .vue-slider-process {
    background-color: var(--primary) !important;
  }
  .vue-slider-dot-tooltip-inner {
    background-color: var(--primary);
    border-color: var(--primary);
  }
  .vue-slider-dot-handle {
    background-color: var(--text-body);
  }
</style>
<script lang="ts">
  import Vue from 'vue'
  import VueSlider from 'vue-slider-component'

  export default Vue.extend({
    components: {
      VueSlider,
    },
    props: {
      value: { type: Number, required: true },
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      step: { type: Number, required: true },
      percent: { type: Boolean, default: false },
    },
    methods: {
      onInput(value: number) {
        this.$emit('input', value)
      },
      formatter(value: number) {
        return this.percent
          ? `${Math.round(((value - this.min) * 100) / (this.max - this.min))}%`
          : `${value}`
      }
    }
  })
</script>
