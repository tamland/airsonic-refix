<template>
  <div>
    <div class="col" d-flex fill-height grow>
          <h1>{{ track.name }}</h1>
        <div>{{ track.artist }}</div>
        <v-card color=blue tile height="100%" width="100%"></v-card>
    </div>
  </div>
</template>
<style scoped lang="scss">
.on-hover {
  opacity: 0.6;
 }

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}

</style>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    album: Object
  }
});
</script>
