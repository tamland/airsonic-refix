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
    <b-dropdown-item-button @click="download()">
      Download
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
        this.starred = !this.starred
        if (this.starred) {
          return this.$api.unstar('track', this.track.id)
        }
        return this.$api.star('track', this.track.id)
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
