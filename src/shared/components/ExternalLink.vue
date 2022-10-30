<template>
  <a :href="$attrs.href"
     target="_blank"
     rel="noopener noreferrer"
     :class="[$data.class, $data.staticClass]">
    <slot />
  </a>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
