<template>
  <td class="d-none d-lg-table-cell">
    <template v-for="(artist, index) in $attrs.track.artists" :key="artist.id">
      <span v-if="index > 0" :key="artist.id">, </span>
      <router-link v-if="artist.id" :to="{name: 'artist', params: { id: artist.id }}" @click.stop>
        {{ artist.name }}
      </router-link>
      <template v-else>
        {{ artist.name }}
      </template>
    </template>
  </td>
</template>
