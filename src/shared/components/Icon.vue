<template>
  <BIcon :icon="icon" v-bind="$attrs" />
</template>
<script lang="ts">
  import Vue from 'vue'
  import {
    BIcon,
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
    BIconSkipStartFill,
    BIconSkipEndFill,
    BIconPlus,
    BIconThreeDotsVertical,
    BIconBoxArrowRight,
    BIconPersonFill,
    BIconPersonCircle,
    BIconX,
  } from 'bootstrap-vue'

  export default Vue.extend({
    components: {
      BIcon,
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
      BIconSkipStartFill,
      BIconSkipEndFill,
      BIconPlus,
      BIconThreeDotsVertical,
      BIconBoxArrowRight,
      BIconPersonFill,
      BIconPersonCircle,
      BIconX,
    },
    props: {
      icon: { type: String, required: true }
    },
  })
</script>
