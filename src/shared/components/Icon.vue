<template>
  <span :class="`mdi ${$slots.default[0].text}`"></span>
</template>
<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({});
</script>