<template>
  <div class="tile card">
    <ContextMenu class="tile-img">
      <router-link :to="$attrs.to">
        <img v-if="$attrs.image" :src="$attrs.image">
        <img v-else src="@/shared/assets/fallback.svg">
      </router-link>
      <template #context-menu>
        <slot name="context-menu" />
      </template>
    </ContextMenu>
    <div class="card-body">
      <div class="text-truncate font-weight-bold">
        <slot name="title">
          <router-link :to="$attrs.to">
            {{ $attrs.title }}
          </router-link>
        </slot>
      </div>
      <div class="text-truncate text-muted">
        <slot name="text">
          {{ $attrs.text }}
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({})
</script>
<style lang="scss">
  .tile-img {
    position: relative;
    width: 100%;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
