import Vue from 'vue'
import ContentLoader from './ContentLoader.vue'
import ExternalLink from './ExternalLink.vue'
import Icon from './Icon.vue'
import InfiniteLoader from './InfiniteLoader.vue'
import OverflowMenu from './OverflowMenu.vue'
import Slider from './Slider.vue'
import Tiles from './Tiles.vue'
import Tile from './Tile.vue'
import {
  BAlert,
  BAvatar,
  BButton,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BModal,
  BOverlay,
  BPopover,
  BProgress,
  BSidebar,
  DropdownPlugin,
} from 'bootstrap-vue'

Vue.component('BModal', BModal)
Vue.component('BAlert', BAlert)
Vue.component('BAvatar', BAvatar)
Vue.component('BSidebar', BSidebar)
Vue.component('BFormGroup', BFormGroup)
Vue.component('BFormInput', BFormInput)
Vue.component('BFormCheckbox', BFormCheckbox)
Vue.component('BFormTextarea', BFormTextarea)
Vue.component('BButton', BButton)
Vue.component('BPopover', BPopover)
Vue.component('BProgress', BProgress)
Vue.component('BOverlay', BOverlay)
Vue.use(DropdownPlugin)

const components = {
  ContentLoader,
  ExternalLink,
  Icon,
  InfiniteLoader,
  OverflowMenu,
  Slider,
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
