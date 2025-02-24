<template>
  <div class="tile card">
    <ContextMenu class="tile-img" :enabled="!!$slots['context-menu']">
      <router-link :to="$attrs.to">
        <img v-if="$attrs.image" :src="$attrs.image">
        <img v-else src="@/shared/assets/fallback.svg">
      </router-link>
      <template #context-menu>
        <slot name="context-menu" />
      </template>
    </ContextMenu>
    <div class="card-body">
      <div class="text-truncate fw-bold">
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
<style>
  .tile-img {
    position: relative;
    width: 100%;

    & img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
