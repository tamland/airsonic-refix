<template>
  <BIcon :icon="icon" v-bind="$attrs" />
</template>
<script lang="ts">
  import Vue from 'vue'
  import {
    BIcon,
    BIconArrowRepeat,
    BIconBoxArrowUpRight,
    BIconBroadcast,
    BIconCardText,
    BIconChevronCompactRight,
    BIconMusicNoteList,
    BIconStar,
    BIconStarFill,
    BIconCollection,
    BIconCollectionFill,
    BIconList,
    BIconPlayFill,
    BIconPauseFill,
    BIconShuffle,
    BIconSkipStartFill,
    BIconSkipEndFill,
    BIconPlus,
    BIconThreeDotsVertical,
    BIconBoxArrowRight,
    BIconPersonFill,
    BIconRss,
    BIconX,
    BIconVolumeMuteFill,
    BIconVolumeUpFill,
  } from 'bootstrap-vue'

  export default Vue.extend({
    components: {
      BIcon,
      BIconArrowRepeat,
      BIconBoxArrowUpRight,
      BIconBroadcast,
      BIconCardText,
      BIconChevronCompactRight,
      BIconMusicNoteList,
      BIconStar,
      BIconStarFill,
      BIconCollection,
      BIconCollectionFill,
      BIconList,
      BIconPlayFill,
      BIconPauseFill,
      BIconShuffle,
      BIconSkipStartFill,
      BIconSkipEndFill,
      BIconPlus,
      BIconThreeDotsVertical,
      BIconBoxArrowRight,
      BIconPersonFill,
      BIconRss,
      BIconX,
      BIconVolumeMuteFill,
      BIconVolumeUpFill,
    },
    props: {
      icon: { type: String, required: true }
    },
  })
</script>
