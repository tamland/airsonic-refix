<template>
  <div class="card">
    <img class="card-img-top" :src="item.image">
    <div class="card-body">
      <div class=" ">
        <div class="text-truncate">
          <router-link :to="{name: 'album', params: { id: item.id } }">
            <strong>{{ item.name }}</strong>
          </router-link>
        </div>
        <div class="text-truncate text-muted">
          {{ item.artist }}
        </div>
      </div>
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
      item: Object
    }
  });
</script>
