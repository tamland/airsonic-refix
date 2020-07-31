<template>
  <Tiles>
    <Tile v-for="item in items" :key="item.id"
      :image="item.image"
      :to="{name: 'artist', params: { id: item.id } }"
      :title="item.name">
      <template v-slot:text>
        <strong>{{ item.albumCount }}</strong> albums
      </template>
    </Tile>
  </Tiles>
</template>
<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {
        items: []
      };
    },
    created() {
      this.$api.getArtists().then(items => {
        this.items = items;
      });
    }
  });
</script>
