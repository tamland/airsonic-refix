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
  import { defineComponent, ref } from 'vue'
  import { usePlaylistStore } from '@/playlist/store'

  export default defineComponent({
    props: {
      visible: { type: Boolean, required: true },
    },
    setup(props, { emit }) {
      const name = ref('')
      const store = usePlaylistStore()
      return {
        name,
        confirm: () => {
          store.create(name.value)
        },
        change: () => {
          name.value = ''
          emit('update:visible', false)
        },
      }
    },
  })
</script>
