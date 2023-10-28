<template functional>
  <td class="d-none d-lg-table-cell">
    <template v-if="props.track.artists.length">
      <template v-for="(artist, index) in props.track.artists">
        <span v-if="index > 0" :key="artist.id" class="text-muted">, </span>
        <router-link :key="`${artist.id}-link`" :to="{name: 'artist', params: { id: artist.id }}" class="text-muted">{{ artist.name }}</router-link>
      </template>
    </template>
    <template v-else>
      {{ props.track.artist }}
    </template>
  </td>
</template>
