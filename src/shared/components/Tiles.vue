<template functional>
 <div class="tiles" :class="props.square ? 'tiles-sq' : 'tiles-rect'">
    <div v-for="(item, index) in props.items" :key="item.id">
      <div class="card">
        <div class="tile-img bg-secondary">
          <div class="tile-img-inner">
            <img v-if="item.image" :src="item.image">
            <Icon v-else class="fallback-img text-muted" icon="music-note-beamed"/>
          </div>
        </div>
        <div class="card-body">
          <slot :item="item" :index="index"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .tiles {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  @media(max-width: 442px) { // 15px padding + 200px tile + 12px gap + 200px tile + 15px padding
    .tiles {
      grid-gap: 8px;
      grid-template-columns: repeat(2, minmax(1px, 1fr))
    }
  }

  .tiles-sq {
    .tile-img {
      padding-bottom: 100%;
    }
  }
  .tiles-rect {
    .tile-img {
      padding-bottom: 70%;
    }
  }
  .tile-img {
    position: relative;
    width: 100%;
    
    .tile-img-inner {
      position: absolute;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .fallback-img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4.5rem;
      }
    }
  }
</style>
<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    props: {
      items: { type: Array, required: true },
      square: { type: Boolean, default: false },
    }
  });
</script>