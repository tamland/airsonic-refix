<template>
  <Tiles>
    <Tile v-for="item in $attrs.items" :key="item.id"
          :to="{name: 'artist', params: { id: item.id } }"
          :title="item.name" :image="item.image">
      <template #text>
        <strong>{{ item.albumCount }}</strong> albums
      </template>
    </Tile>
  </Tiles>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
