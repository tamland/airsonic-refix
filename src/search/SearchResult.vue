<template>
  <div v-if="result">
    <div>
      <h5 class="text-uppercase">Artists</h5>
      <ArtistList :items="result.artists"/>

      <b-table-simple hover borderless>
        <tbody>
          <tr v-for="item in result.artists" :key="item.id">
            <td>{{ item.name }}</td>
          </tr>
        </tbody>
      </b-table-simple>
    </div>

    <div>
      <h5 class="text-uppercase">Albums</h5>
      <AlbumList :items="result.albums"/>
      <b-table-simple hover borderless>
        <tbody>
          <tr v-for="item in result.albums">
            <td>{{ item.name }}</td>
            <td>{{ item.artist }}</td>
          </tr>
        </tbody>
      </b-table-simple>
    </div>

    <div>
      <h5 class="text-uppercase">Tracks</h5>
        <b-table-simple hover>
      <!-- <thead>
        <tr>
          <th class="text-left"></th>
          <th class="text-left">Title</th>
          <th class="text-left">Artist</th>
          <th class="text-left">Album</th>
          <th class="text-left">Duration</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead> -->
      <tbody>
        <tr v-for="(item, index) in result.tracks">
          <td>
            <span  @click="play(index)">
              <Icon icon="play-fill"/>
            </span>
          </td>
          <td>{{ item.title }}</td>
          <td>{{ item.artist }}</td>
          <td>{{ item.album }}</td>
          <!-- <td>{{ item.duration | duration }}</td> -->
        </tr>
      </tbody>
    </b-table-simple>

  </div>
  </div>
</template>
<script lang="ts">
  import Vue from "vue";
  import AlbumList from "@/library/album/AlbumList.vue";
  import ArtistList from "@/library/artist/ArtistList.vue";

  export default Vue.extend({
    components: {
      AlbumList,
      ArtistList,
    },
    props: {
      query: String,
    },
    data() {
      return {
        result: null as any,
      };
    },
    watch: {
      query: {
        immediate: true,
        handler(value: string) {
          this.$api.search(this.query).then(result => {
            this.result = result;
          });
        }
      }
    },
  });
</script>
