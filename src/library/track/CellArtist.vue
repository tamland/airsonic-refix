<template functional>
  <td class="d-none d-lg-table-cell">
    <template v-for="(artist, index) in props.track.artists">
      <span v-if="index > 0" :key="artist.id">, </span>
      <router-link v-if="artist.id" :key="`${artist.id}-link`" :to="{name: 'artist', params: { id: artist.id }}">
        {{ artist.name }}
      </router-link>
      <template v-else>
        {{ artist.name }}
      </template>
    </template>
  </td>
</template>
