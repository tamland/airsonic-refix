<template>
  <BIcon :icon="icon"/>
</template>
<script lang="ts">
  import Vue from 'vue'
  import {
    BIcon,
    BIconCardText,
    BIconMusicNoteList,
    BIconStarFill,
    BIconCollectionFill,
    BIconList,
    BIconPlayFill,
    BIconPauseFill,
    BIconSkipStartFill,
    BIconSkipEndFill,
    BIconPlus,
    BIconThreeDotsVertical,
    BIconMusicNoteBeamed,
    BIconBoxArrowRight,
    BIconPersonFill,
  } from 'bootstrap-vue'

  export default Vue.extend({
    components: {
      BIcon,
      BIconCardText,
      BIconMusicNoteList,
      BIconStarFill,
      BIconCollectionFill,
      BIconList,
      BIconPlayFill,
      BIconPauseFill,
      BIconSkipStartFill,
      BIconSkipEndFill,
      BIconPlus,
      BIconThreeDotsVertical,
      BIconMusicNoteBeamed,
      BIconBoxArrowRight,
      BIconPersonFill,
    },
    props: {
      icon: { type: String }
    },
  })
</script>
