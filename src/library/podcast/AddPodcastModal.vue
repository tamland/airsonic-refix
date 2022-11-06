<template>
  <b-modal :visible="visible" @ok="confirm" @change="change">
    <template #modal-header-close>
      <Icon icon="x" />
    </template>
    <template #modal-ok>
      Add
    </template>
    <template #modal-title>
      Add podcast
    </template>
    <div class="form-group">
      <label>URL</label>
      <input v-model="url" class="form-control" type="text" :class="{'is-invalid': hasError}">
      <div class="invalid-feedback">
        Required
      </div>
    </div>
  </b-modal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      visible: { type: Boolean, required: true },
    },
    data() {
      return {
        url: '',
        hasError: false,
      }
    },
    methods: {
      confirm(event: any) {
        if (this.url.length === 0) {
          this.hasError = true
          event.preventDefault()
          return
        }
        this.$emit('confirm', this.url)
      },
      change() {
        this.hasError = false
        this.url = ''
        this.$emit('update:visible', false)
      },
    }
  })
</script>
