<template>
  <BIcon :icon="icon" v-bind="$attrs" />
</template>
<script lang="ts">
  import Vue from 'vue'
  import {
    BIcon,
    BIconArrowCounterclockwise,
    BIconArrowRepeat,
    BIconBoxArrowUpRight,
    BIconBroadcast,
    BIconCardText,
    BIconChevronCompactRight,
    BIconCollection,
    BIconDownload,
    BIconHeart,
    BIconHeartFill,
    BIconList,
    BIconListUl,
    BIconMusicNoteList,
    BIconPauseFill,
    BIconPencilSquare,
    BIconPersonFill,
    BIconPlayFill,
    BIconPlus,
    BIconRss,
    BIconShuffle,
    BIconSkipEndFill,
    BIconSkipStartFill,
    BIconThreeDotsVertical,
    BIconVolumeMuteFill,
    BIconVolumeUpFill,
    BIconX,
  } from 'bootstrap-vue'

  export default Vue.extend({
    components: {
      BIcon,
      BIconChevronRight: BIconChevronCompactRight,
      BIconDiscover: BIconCardText,
      BIconDownload: BIconDownload,
      BIconEdit: BIconPencilSquare,
      BIconHeart: BIconHeart,
      BIconHeartFill: BIconHeartFill,
      BIconLibrary: BIconCollection,
      BIconLink: BIconBoxArrowUpRight,
      BIconList: BIconListUl,
      BIconMute: BIconVolumeMuteFill,
      BIconNav: BIconList,
      BIconPause: BIconPauseFill,
      BIconPerson: BIconPersonFill,
      BIconPlay: BIconPlayFill,
      BIconPlaylist: BIconMusicNoteList,
      BIconPlus: BIconPlus,
      BIconPodcast: BIconRss,
      BIconRadio: BIconBroadcast,
      BIconRefresh: BIconArrowCounterclockwise,
      BIconRepeat: BIconArrowRepeat,
      BIconShuffle: BIconShuffle,
      BIconSkipEnd: BIconSkipEndFill,
      BIconSkipStart: BIconSkipStartFill,
      BIconThreeDotsVertical: BIconThreeDotsVertical,
      BIconVolume: BIconVolumeUpFill,
      BIconX: BIconX,
    },
    props: {
      icon: { type: String, required: true }
    },
  })
</script>
