<template>
  <Tiles square :allow-h-scroll="allowHScroll">
    <Tile
      v-for="item in items" :key="item.id"
      :image="item.image"
      :to="{name: 'album', params: { id: item.id } }"
      :title="item.name"
      :draggable="true" @dragstart="dragstart(item.id, $event)"
    >
      <template #text>
        <slot name="text" v-bind="item">
          <template v-for="(artist, index) in item.artists">
            <span v-if="index > 0" :key="artist.id" class="text-muted">, </span>
            <router-link :key="`${artist.id}-link`" :to="{name: 'artist', params: { id: artist.id }}" class="text-muted">
              {{ artist.name }}
            </router-link>
          </template>
        </slot>
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
        <ContextMenuItem
          :icon="favourites[item.id] ? 'heart-fill' : 'heart'"
          @click="toggleFavourite(item.id)"
        >
          Favourite
        </ContextMenuItem>
      </template>
    </Tile>
  </Tiles>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { useFavouriteStore } from '@/library/favourite/store'
  import { usePlayerStore } from '@/player/store'

  export default defineComponent({
    props: {
      items: { type: Array, required: true },
      allowHScroll: { type: Boolean, default: false },
    },
    setup() {
      return {
        favouriteStore: useFavouriteStore(),
        playerStore: usePlayerStore(),
      }
    },
    computed: {
      favourites(): any {
        return this.favouriteStore.albums
      },
    },
    methods: {
      async playNow(id: string) {
        const album = await this.$api.getAlbumDetails(id)
        return this.playerStore.playTrackList(album.tracks!)
      },
      async playNext(id: string) {
        const album = await this.$api.getAlbumDetails(id)
        return this.playerStore.setNextInQueue(album.tracks!)
      },
      async playLater(id: string) {
        const album = await this.$api.getAlbumDetails(id)
        return this.playerStore.addToQueue(album.tracks!)
      },
      toggleFavourite(id: string) {
        return this.favouriteStore.toggle('album', id)
      },
      dragstart(id: string, event: any) {
        event.dataTransfer.setData('application/x-album-id', id)
      },
    }
  })
</script>
