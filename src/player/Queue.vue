<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="mb-0">
        Playing
      </h1>
      <b-button variant="secondary" @click="clear()">
        Clear
      </b-button>
    </div>
    <TrackList :tracks="tracks">
      <template #context-menu="{index}">
        <b-dropdown-item-button @click="remove(index)">
          Remove
        </b-dropdown-item-button>
      </template>
    </TrackList>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { mapState, mapMutations } from 'vuex'
  import TrackList from '@/library/track/TrackList.vue'

  export default Vue.extend({
    components: {
      TrackList,
    },
    computed: {
      ...mapState('player', {
        tracks: (state: any) => state.queue,
      })
    },
    methods: {
      ...mapMutations('player', {
        remove: 'removeFromQueue',
        clear: 'clearQueue',
      }),
    }
  })
</script>
