<template>
  <b-modal ok-title="Save" :visible="visible" @ok="confirm" @change="change">
    <template #modal-header-close>
      <Icon icon="x" />
    </template>
    <template #modal-title>
      <slot name="title" :item="copy">
        {{ title }}
      </slot>
    </template>
    <template v-if="visible">
      <slot :item="copy" />
    </template>
  </b-modal>
</template>
<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      item: { type: Object, default: null },
      visible: { type: Boolean, required: true },
      title: { type: String, default: '' },
    },
    data() {
      return {
        copy: null,
      }
    },
    watch: {
      item: {
        immediate: true,
        handler(value: any) {
          this.copy = { ...value }
        }
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm', this.copy)
      },
      change() {
        this.$emit('update:visible', false)
      },
    }
  })
</script>
