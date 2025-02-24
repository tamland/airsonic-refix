<template>
  <b-modal :show="visible" ok-title="Create" @ok="confirm" @hidden="hidden">
    <template #header>
      <h5 class="modal-title">
        New playlist
      </h5>
      <button class="btn-close" @click="hidden" />
    </template>
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input v-model="name" class="form-control" type="text">
    </div>
  </b-modal>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue'
  import { usePlaylistStore } from '@/library/playlist/store'
  import { Track } from '@/shared/api'

  export default defineComponent({
    props: {
      visible: { type: Boolean, required: true },
      tracks: { type: Array as PropType<Track[] | null>, default: null },
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
      const name = ref('')
      const store = usePlaylistStore()
      return {
        name,
        confirm: () => {
          store.create(name.value, props.tracks?.map(item => item.id))
        },
        hidden: () => {
          name.value = ''
          emit('update:visible', false)
        },
      }
    },
  })
</script>
