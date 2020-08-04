<template>
  <div>
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
import Vue from "vue";
import { mapState, mapMutations, mapActions } from 'vuex';
import TrackList from "@/library/TrackList.vue";

export default Vue.extend({
  components: {
    TrackList,
  },
  computed: {
    ...mapState("player", {
      tracks: (state: any) => state.queue,
    })
  },
  methods: {
    ...mapMutations("player", {
      remove: "removeFromQueue",
    }),
  }
});
</script>
