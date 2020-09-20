import Vue from 'vue'
import ContentLoader from './ContentLoader.vue'
import ExternalLink from './ExternalLink.vue'
import Icon from './Icon.vue'
import OverflowMenu from './OverflowMenu.vue'
import Tiles from './Tiles.vue'
import Tile from './Tile.vue'

const components = {
  ContentLoader,
  ExternalLink,
  Icon,
  OverflowMenu,
  Tiles,
  Tile,
}

Object.keys(components).forEach((_key) => {
  const key = _key as keyof typeof components
  Vue.component(key, components[key])
})

Vue.prototype.$formatDuration = (value: number) => {
  if (!isFinite(value)) {
    return '∞'
  }
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
