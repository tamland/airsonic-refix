<template>
  <div>
    <form class="form-inline my-2 my-lg-0" @submit.prevent="search">
      <input
        v-model="query"
        class="form-control mr-sm-2" type="search"
        placeholder="Search">
    </form>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  export default defineComponent({
    data() {
      return {
        query: ''
      }
    },
    methods: {
      search(): void {
        this.$router.push({ name: 'search', query: { q: this.query } })
      }
    }
  })
</script>
