<template>
  <BDropdownItemButton
    button-class="d-flex justify-content-between text-nowrap"
    v-on="$listeners"
  >
    <slot>
      {{ text }}
    </slot>
    <Icon v-if="icon" :icon="icon" class="ml-4" />
  </BDropdownItemButton>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      text: { type: String, default: '' },
      icon: { type: String, default: null },
    }
  })
</script>
