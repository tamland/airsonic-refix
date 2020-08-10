<template functional>
  <Tiles square>
    <Tile v-for="item in props.items" :key="item.id"
          :image="item.image"
          :to="{name: 'album', params: { id: item.id } }"
          :title="item.name">
      <template v-slot:text>
        <router-link :to="{name: 'artist', params: { id: item.artistId } }" class="text-muted">
          {{ item.artist }}
        </router-link>
      </template>
    </Tile>
  </Tiles>
</template>
