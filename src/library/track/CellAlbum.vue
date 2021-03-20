<template functional>
  <td class="d-none d-md-table-cell">
    <template v-if="props.track.albumId">
      <router-link :to="{name: 'album', params: {id: props.track.albumId}}" @click.native.stop>
        {{ props.track.album }}
      </router-link>
    </template>
    <template v-else>
      {{ props.track.album }}
    </template>
  </td>
</template>
