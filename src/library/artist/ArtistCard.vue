<template>
  <div>
    <div class="text-truncate">
      <router-link :to="{name: 'artist', params: { id: item.id } }">
        <strong>{{ item.name }}</strong>
      </router-link>
    </div>
     <div class="text-truncate text-muted">
      <strong>{{ item.albumCount }}</strong> albums
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    props: {
      item: { type: Object, required: true }
    }
  });
</script>
