<template>
  <b-dropdown variant="link" boundary="window" no-caret toggle-class="p-0">
    <template #button-content>
      <Icon>mdi-dots-vertical</Icon>
    </template>
    <slot/>
  </b-dropdown>
</template>
<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({});
</script>