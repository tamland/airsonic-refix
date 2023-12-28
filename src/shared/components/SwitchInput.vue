<template>
  <div class="custom-control custom-switch">
    <input
      :id="id"
      type="checkbox"
      class="custom-control-input"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    >
    <label :for="id" class="custom-control-label" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { uniqueId } from 'lodash-es'

  export default defineComponent({
    props: {
      value: { type: Boolean, default: false },
    },
    computed: {
      id(): string {
        return uniqueId('switch-')
      }
    },
  })
</script>
