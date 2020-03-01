import Vue from 'vue';
import Icon from "./Icon.vue";
import OverflowMenu from "./OverflowMenu.vue";
import Spinner from "./Spinner.vue";
import Tiles from "./Tiles.vue";

const components = {
  Icon,
  OverflowMenu,
  Spinner,
  Tiles,
};

type Key = keyof typeof components;

Object.keys(components).forEach((_key) => {
  const key = _key as keyof typeof components;
  Vue.component(key, components[key]);
});
