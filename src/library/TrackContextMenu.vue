<template>
  <b-dropdown variant="link" boundary="window" no-caret toggle-class="p-0">
    <template #button-content>
      <Icon icon="three-dots-vertical" />
    </template>
    <b-dropdown-item-button @click="setNextInQueue()">
      Play next
    </b-dropdown-item-button>
    <b-dropdown-item-button @click="addToQueue()">
      Add to queue
    </b-dropdown-item-button>
    <b-dropdown-item-button @click="toggleStarred()">
      {{ starred ? 'Unstar' : 'Star' }}
    </b-dropdown-item-button>
    <slot :item="track" />
  </b-dropdown>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      track: { type: Object, required: true },
    },
    data() {
      return {
        starred: this.track.starred,
      }
    },
    methods: {
      toggleStarred() {
        if (this.starred) {
          this.$api.unstar('track', this.track.id)
        } else {
          this.$api.star('track', this.track.id)
        }
        this.starred = !this.starred
      },
      setNextInQueue() {
        return this.$store.dispatch('player/setNextInQueue', this.track)
      },
      addToQueue() {
        return this.$store.dispatch('player/addToQueue', this.track)
      },
    }
  })
</script>
