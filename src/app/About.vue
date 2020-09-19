<template>
  <b-modal size="lg" hide-header hide-footer :visible="visible" @change="$emit('close')">
    <div style="width: 200px" class="mx-auto mb-3">
      <Logo />
    </div>
    <div class="text-center">
      <ExternalLink :href="url">
        GitHub <Icon icon="box-arrow-up-right" />
      </ExternalLink>
      <p>
        Licensed under the AGPLv3 license.
      </p>
      <div>Build: {{ build }}</div>
      <div>Build date: {{ buildDate }}</div>
    </div>
    <div class="d-flex justify-content-end">
      <button class="btn btn-secondary" @click="$emit('close')">
        Close
      </button>
    </div>
  </b-modal>
</template>
<script lang="ts">
  import Vue from 'vue'
  import Logo from './Logo.vue'

  export default Vue.extend({
    components: {
      Logo,
    },
    props: {
      visible: { type: Boolean, required: true },
    },
    computed: {
      build: () => process.env.VUE_APP_BUILD,
      buildDate: () => process.env.VUE_APP_BUILD_DATE,
      url: () => 'https://github.com/tamland/airsonic-frontend'
    },
  })
</script>
