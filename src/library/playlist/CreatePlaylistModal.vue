<template>
  <b-modal :visible="visible" @ok="confirm" @change="change">
    <template #modal-header>
      <h5 class="modal-title">
        New playlist
      </h5>
      <button class="btn-close" @click="change" />
    </template>
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input v-model="name" class="form-control" type="text">
    </div>
    <template #modal-ok>
      Create
    </template>
  </b-modal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { usePlaylistStore } from '@/library/playlist/store'

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
