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
    BIconDownload,
    BIconMusicNoteList,
    BIconCollection,
    BIconCollectionFill,
    BIconList,
    BIconListUl,
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
    BIconHeart,
    BIconHeartFill,
  } from 'bootstrap-vue'

  export default Vue.extend({
    components: {
      BIcon,
      BIconArrowRepeat,
      BIconBoxArrowUpRight,
      BIconBroadcast,
      BIconCardText,
      BIconChevronCompactRight,
      BIconDownload,
      BIconMusicNoteList,
      BIconCollection,
      BIconCollectionFill,
      BIconList,
      BIconListUl,
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
      BIconHeart,
      BIconHeartFill,
    },
    props: {
      icon: { type: String, required: true }
    },
  })
</script>
