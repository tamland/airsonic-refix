<template>
  <div class="form-check form-switch">
    <input
      :id="id"
      type="checkbox" role="switch"
      class="form-check-input"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    >
    <label :for="id" class="form-check-label" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { uniqueId } from 'lodash-es'

  export default defineComponent({
    props: {
      value: { type: Boolean, default: false },
    },
    emits: ['input'],
    computed: {
      id(): string {
        return uniqueId('switch-')
      }
    },
  })
</script>
