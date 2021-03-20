<template functional>
  <td class="d-none d-lg-table-cell">
    <template v-if="props.track.artistId">
      <router-link :to="{name: 'artist', params: {id: props.track.artistId}}" @click.native.stop>
        {{ props.track.artist }}
      </router-link>
    </template>
    <template v-else>
      {{ props.track.artist }}
    </template>
  </td>
</template>
