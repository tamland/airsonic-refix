import Avatar from './Avatar.vue'
import ContentLoader from './ContentLoader.vue'
import ContextMenu from '@/shared/components/ContextMenu.vue'
import ContextMenuItem from '@/shared/components/ContextMenuItem.vue'
import EmptyIndicator from './EmptyIndicator.vue'
import ExternalLink from './ExternalLink.vue'
import Hero from './Hero.vue'
import Icon from './Icon.vue'
import InfiniteLoader from './InfiniteLoader.vue'
import OverflowMenu from './OverflowMenu.vue'
import Slider from './Slider.vue'
import Tiles from './Tiles.vue'
import Tile from './Tile.vue'
import {
  BAlert,
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
  BToast,
} from 'bootstrap-vue'

export const components = {
  Avatar,
  BAlert,
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
  BToast,
  ContentLoader,
  ContextMenu,
  ContextMenuItem,
  EmptyIndicator,
  ExternalLink,
  Hero,
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
