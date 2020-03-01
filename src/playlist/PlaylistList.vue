<template>
  <div>
    <b-table-simple>
    <thead>
      <tr>
        <th>Name</th>
        <th>Created</th>
        <th>Updated</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in playlists" :key="item.id">
        <td>
          <router-link :to="{name: 'playlist', params: { id: item.id } }">
            {{ item.name }}
          </router-link>
        </td>
        <td>{{ item.created | dateTime }}</td>
        <td>{{ item.changed | dateTime }}</td>
        <td class="text-right">
          <OverflowMenu>
            <b-dropdown-item-btn @click="deletePlaylist(item.id)">Delete</b-dropdown-item-btn>
          </OverflowMenu>
        </td>
      </tr>
    </tbody>
    </b-table-simple>
  </div>
</template>
<script lang="ts">
  import Vue from "vue";
  import { mapState, mapActions } from 'vuex';

  export default Vue.extend({
    computed: {
      ...mapState([
        "playlists"
      ]),
    },
    methods: {
      ...mapActions({
        deletePlaylist: 'deletePlaylist'
      })
    }
  });
</script>
