import Vue from 'vue';
import ExternalLink from "./ExternalLink.vue";
import Icon from "./Icon.vue";
import OverflowMenu from "./OverflowMenu.vue";
import Spinner from "./Spinner.vue";
import Tiles from "./Tiles.vue";
import Tile from "./Tile.vue";

const components = {
  ExternalLink,
  Icon,
  OverflowMenu,
  Spinner,
  Tiles,
  Tile,
};

type Key = keyof typeof components;

Object.keys(components).forEach((_key) => {
  const key = _key as keyof typeof components;
  Vue.component(key, components[key]);
});
