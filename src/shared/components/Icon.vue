<template>
  <BIcon :icon="icon" v-bind="$attrs" />
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
    BIconPersonCircle,
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
      BIconPersonCircle,
    },
    props: {
      icon: { type: String, required: true }
    },
  })
</script>
