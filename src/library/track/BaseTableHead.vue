<template>
  <thead>
    <tr>
      <th>#</th>
      <th class="text-left">
        Title
      </th>
      <slot />
      <th class="text-right">
        Actions
      </th>
    </tr>
  </thead>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
