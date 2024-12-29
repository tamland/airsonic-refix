<template>
  <b-modal :visible="visible" @ok="confirm" @change="change">
    <template #modal-header>
      <h5 class="modal-title">
        Add podcast
      </h5>
      <button class="btn-close" @click="change" />
    </template>
    <div class="mb-3">
      <label class="form-label">URL</label>
      <input v-model="url" class="form-control" type="text" :class="{'is-invalid': hasError}">
      <div class="invalid-feedback">
        Required
      </div>
    </div>
    <template #modal-ok>
      Add
    </template>
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
