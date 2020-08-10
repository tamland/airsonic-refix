<template functional>
  <div>
    <slot v-if="props.data" :data="props.data" />
    <div v-else class="text-center">
      <span class="spinner-grow" />
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({})
</script>
