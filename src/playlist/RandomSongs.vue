<template>
  <div v-if="items">
    <TrackList :tracks="items" />
    <table class="table">
      <thead />
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>
            <Icon icon="play-fill" @click="() => {}" />
            <Icon icon="plus" @click="() => {}" />
          </td>
          <td>{{ item.artist }}</td>
          <td>{{ item.album }}</td>
          <td>{{ $formatDuration(item.duration) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import TrackList from '@/library/TrackList.vue'

  export default Vue.extend({
    components: {
      TrackList,
    },
    data() {
      return {
        loading: true,
        items: [] as any[],
      }
    },
    created() {
      this.$api.getRandomSongs().then(items => {
        this.loading = false
        this.items = items// .sort((a: any, b:any) => a.created.localeCompare(b.created));
      })
    }
  })
</script>
