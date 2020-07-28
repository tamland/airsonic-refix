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
    BIconVolumeUpFill,
    BIconPlayFill,
    BIconPauseFill,
    BIconSkipStartFill,
    BIconSkipEndFill,
    BIconPlus,
    BIconThreeDotsVertical,
    BIconMusicNoteBeamed,
    BIconBoxArrowRight,
  } from 'bootstrap-vue'

  export default Vue.extend({
    components: {
      BIcon,
      BIconCardText,
      BIconMusicNoteList,
      BIconStarFill,
      BIconCollectionFill,
      BIconList,
      BIconVolumeUpFill,
      BIconPlayFill,
      BIconPauseFill,
      BIconSkipStartFill,
      BIconSkipEndFill,
      BIconPlus,
      BIconThreeDotsVertical,
      BIconMusicNoteBeamed,
      BIconBoxArrowRight,
    },
    props: {
      icon: { type: String }
    },
  })
</script>
