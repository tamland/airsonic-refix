<template functional>
  <Tiles>
    <Tile v-for="item in props.items" :key="item.id"
          :to="{name: 'artist', params: { id: item.id } }"
          :title="item.name">
      <template v-slot:text>
        <strong>{{ item.albumCount }}</strong> albums
      </template>
    </Tile>
  </Tiles>
</template>
