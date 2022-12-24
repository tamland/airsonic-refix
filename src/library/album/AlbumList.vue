<template>
  <Tiles square>
    <Tile
      v-for="item in items" :key="item.id"
      :image="item.image"
      :to="{name: 'album', params: { id: item.id } }"
      :title="item.name"
      :draggable="true" @dragstart="dragstart(item.id, $event)"
    >
      <template #text>
        <router-link :to="{name: 'artist', params: { id: item.artistId } }" class="text-muted">
          {{ item.artist }}
        </router-link>
      </template>

      <template #context-menu>
        <ContextMenuItem icon="play" @click="playNow(item.id)">
          Play
        </ContextMenuItem>
        <ContextMenuItem icon="plus" @click="playNext(item.id)">
          Play next
        </ContextMenuItem>
        <ContextMenuItem icon="plus" @click="playLater(item.id)">
          Add to queue
        </ContextMenuItem>
        <ContextMenuItem :icon="favourites[item.id] ? 'heart-fill' : 'heart'"
                         @click="toggleFavourite(item.id)">
          Favourite
        </ContextMenuItem>
      </template>
    </Tile>
  </Tiles>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      items: { type: Array, required: true },
    },
    computed: {
      favourites(): any {
        return this.$store.state.favourites.albums
      },
    },
    methods: {
      async playNow(id: string) {
        const album = await this.$api.getAlbumDetails(id)
        return this.$store.dispatch('player/playTrackList', {
          tracks: album.tracks,
        })
      },
      async playNext(id: string) {
        const album = await this.$api.getAlbumDetails(id)
        return this.$store.dispatch('player/setNextInQueue', album.tracks)
      },
      async playLater(id: string) {
        const album = await this.$api.getAlbumDetails(id)
        return this.$store.dispatch('player/addToQueue', album.tracks)
      },
      toggleFavourite(id: string) {
        return this.$store.dispatch('favourites/toggle', { id, type: 'album' })
      },
      dragstart(id: string, event: any) {
        event.dataTransfer.setData('application/x-album-id', id)
      },
    }
  })
</script>
