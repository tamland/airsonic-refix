<template>
  <b-modal ok-title="Save" :show="visible" @ok="confirm" @hidden="hidden">
    <template #header>
      <h5 class="modal-title">
        <slot name="title" :item="copy">
          {{ title }}
        </slot>
      </h5>
      <button class="btn-close" @click="hidden" />
    </template>
    <template v-if="visible">
      <slot :item="copy" />
    </template>
  </b-modal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      item: { type: Object, default: null },
      visible: { type: Boolean, required: true },
      title: { type: String, default: '' },
    },
    emits: ['confirm', 'update:visible'],
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
      hidden() {
        this.$emit('update:visible', false)
      },
    }
  })
</script>
