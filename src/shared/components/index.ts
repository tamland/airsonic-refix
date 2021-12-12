import ContentLoader from './ContentLoader.vue'
import ContextMenu from '@/shared/components/ContextMenu.vue'
import ContextMenuItem from '@/shared/components/ContextMenuItem.vue'
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
  BDropdown,
  BDropdownDivider,
  BDropdownItem,
  BDropdownItemButton,
  BDropdownText,
  BFormCheckbox,
  BModal,
  BOverlay,
  BPopover,
  BSidebar,
} from 'bootstrap-vue'

export const components = {
  BAlert,
  BAvatar,
  BButton,
  BDropdown,
  BDropdownDivider,
  BDropdownItem,
  BDropdownItemButton,
  BDropdownText,
  BFormCheckbox,
  BModal,
  BOverlay,
  BPopover,
  BSidebar,
  ContentLoader,
  ContextMenu,
  ContextMenuItem,
  ExternalLink,
  Icon,
  InfiniteLoader,
  OverflowMenu,
  Slider,
  Tiles,
  Tile,
}

export function formatDuration(value: number): string {
  if (!isFinite(value)) {
    return '∞'
  }
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
