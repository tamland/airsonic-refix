<template>
  <b-modal :visible="visible" @ok="confirm" @change="change">
    <template #modal-header-close>
      <Icon icon="x" />
    </template>
    <template #modal-title>
      New playlist
    </template>
    <div class="form-group">
      <label>Name</label>
      <input v-model="name" class="form-control" type="text">
    </div>
    <template #modal-ok>
      Create
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
        name: '',
      }
    },
    methods: {
      confirm() {
        return this.$store.dispatch('createPlaylist', this.name)
      },
      change() {
        this.name = ''
        this.$emit('update:visible', false)
      },
    }
  })
</script>
