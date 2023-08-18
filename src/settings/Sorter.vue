<template>
  <b-list-group variant="secondary" class="m-0">
    <b-list-group-item v-for="option, idx in options" :key="idx" class="p-0">
      <div class="d-flex justify-content-between align-items-center">
        <b-form-checkbox :checked="list.includes(option)" @change="toggleOption(option)">
          {{option.charAt(0).toUpperCase() + option.slice(1)}}
        </b-form-checkbox>
      </div>
    </b-list-group-item>
  </b-list-group>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import {
    BListGroup,
    BListGroupItem,
  } from 'bootstrap-vue'

  export default defineComponent({
    components: {
      BListGroup,
      BListGroupItem,
    },
    props: {
      options: { type: Array, required: true },
      list: { type: Array, required: true },
      save: { type: Function, required: true }
    },
    methods: {
      moveUp(opt: string) {
        this.$emit('list', this.list.filter(i => i === opt))
      },
      moveDown(opt: string) {
        this.$emit('list', this.list.filter(i => i === opt))
      },
      toggleOption(opt: string) {
        if (this.list.includes(opt)) this.save(this.list.filter(i => i !== opt))
        else this.save([...this.list, opt])
      },
    }
  })
</script>

<style scoped>
  .custom-control {
    z-index: unset!important;
  }
</style>
