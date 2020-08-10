<template functional>
  <div class="tile card">
    <router-link class="tile-img" :to="props.to">
      <img v-if="props.image" :src="props.image">
      <Icon v-else class="tile-img-fallback text-muted" icon="music-note-beamed" />
    </router-link>
    <div class="card-body">
      <div class="text-truncate font-weight-bold">
        <slot name="title">
          <router-link :to="props.to">
            {{ props.title }}
          </router-link>
        </slot>
      </div>
      <div class="text-truncate text-muted">
        <slot name="text">
          {{ props.text }}
        </slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .tile-img {
    position: relative;
    width: 100%;
    background-color: #6c757d;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .tile-img-fallback {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4.5rem;
  }
</style>
