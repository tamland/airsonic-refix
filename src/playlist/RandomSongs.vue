<template>
  <div v-if="items">
    <TrackList :tracks="items" show-album/>
    <table class="table">
      <thead>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>
             <Icon @click="() => {}">mdi-play-outline</Icon>
        <Icon @click="() => {}">mdi-plus</Icon>
          </td>
          <td>{{ item.artist }}</td>
          <td>{{ item.album }}</td>
          <td>{{ item.duration | duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import TrackList from "@/library/TrackList.vue";

export default Vue.extend({
  components: {
    TrackList,
  },
  data() {
    return {
      loading: true,
      items: [] as any[],
    };
  },
  created() {
    this.$api.getRandomSongs().then(items => {
      this.loading = false;
      this.items = items;//.sort((a: any, b:any) => a.created.localeCompare(b.created));
    });
  }
});
</script>
