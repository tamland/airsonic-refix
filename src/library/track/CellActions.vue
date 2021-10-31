<template>
  <td class="text-right" @click.stop="">
    <OverflowMenu :disabled="track.playable === false">
      <ContextMenuItem icon="plus" @click="setNextInQueue()">
        Play next
      </ContextMenuItem>
      <ContextMenuItem icon="plus" @click="addToQueue()">
        Add to queue
      </ContextMenuItem>
      <ContextMenuItem :icon="isFavourite ? 'heart-fill' : 'heart'" @click="toggleFavourite()">
        Favourite
      </ContextMenuItem>
      <ContextMenuItem icon="download" @click="download()">
        Download
      </ContextMenuItem>
      <slot :item="track" />
    </OverflowMenu>
  </td>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      track: { type: Object, required: true },
    },
    computed: {
      isFavourite(): boolean {
        return !!this.$store.state.favourites.tracks[this.track.id]
      }
    },
    methods: {
      toggleFavourite() {
        return this.$store.dispatch('favourites/toggle', { id: this.track.id, type: 'track' })
      },
      download() {
        window.location.href = this.$api.getDownloadUrl(this.track.id)
      },
      setNextInQueue() {
        return this.$store.dispatch('player/setNextInQueue', [this.track])
      },
      addToQueue() {
        return this.$store.dispatch('player/addToQueue', [this.track])
      },
    }
  })
</script>
