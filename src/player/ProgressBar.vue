<template>
  <VueSlider
    v-bind="$attrs"
    :value="progress"
    :min="0"
    :max="1"
    :interval="0.00001"
    :lazy="true"
    :contained="true"
    :dot-options="{tooltip: 'always'}"
    :tooltip-formatter="formatter"
    @change="seek"
  />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import VueSlider from 'vue-slider-component'
  import { formatDuration } from '@/shared/utils'
  import { usePlayerStore } from '@/player/store'

  export default defineComponent({
    components: {
      VueSlider,
    },
    setup() {
      return {
        playerStore: usePlayerStore(),
      }
    },
    computed: {
      progress(): number {
        return this.playerStore.progress
      },
    },
    methods: {
      formatter(value: number): string {
        const duration = this.playerStore.duration
        const time = value * duration
        return `${formatDuration(time)} / ${formatDuration(duration)}`
      },
      seek(value: number) {
        this.playerStore.seek(value)
      },
    }
  })
</script>
<style lang="scss" scoped>

  .vue-slider {
    height: 4px !important;
    padding: 5px 0 !important;
    cursor: pointer;
  }
  ::v-deep .vue-slider-rail {
    background-color: var(--bs-secondary);
    border-radius: 0;
  }
  ::v-deep .vue-slider-process {
    background-color: var(--bs-primary);
    border-radius: 0;
  }

  /* dot handle */
  ::v-deep .vue-slider-dot-handle  {
    background-color: var(--bs-primary);
  }
  ::v-deep .vue-slider-dot-handle::after {
    background-color: var(--bs-primary);
    opacity: 0.32;
    transform: translate(-50%, -50%) scale(1);
  }
  .vue-slider:not(:hover) ::v-deep .vue-slider-dot-handle {
    display: none;
  }
  .vue-slider:hover ::v-deep .vue-slider-dot-handle {
    display: block;
  }

  /* dot tooltip */
  .vue-slider:not(:hover) ::v-deep .vue-slider-dot-tooltip {
    display: none;
  }
  .vue-slider:hover ::v-deep .vue-slider-dot-tooltip {
    display: block;
  }
  ::v-deep .vue-slider-dot-tooltip-inner {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
  }
  ::v-deep .vue-slider-dot-tooltip-text {
    display: block;
    transform: none;
    width: auto;
    height: auto;
    font-size: inherit;
  }
  ::v-deep .vue-slider-dot-tooltip-inner {
    font-size: inherit;
    white-space: nowrap;
    padding: 2px 5px;
    min-width: 20px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    border-color: var(--bs-primary);
    background-color: var(--bs-primary);
    box-sizing: content-box;
    transform: none;
  }
  ::v-deep .vue-slider-dot-tooltip-inner::after {
    content: "";
    position: absolute;
  }
  ::v-deep .vue-slider-dot-tooltip-inner-top::after {
    top: 100%;
    left: 50%;
    transform: translate(-50%, 0);
    height: 0;
    width: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 5px;
    border-top-color: inherit;
  }
</style>
