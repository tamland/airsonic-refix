<template>
  <a :href="$attrs.href"
     target="_blank"
     rel="noopener noreferrer"
     :class="[$data.class, $data.staticClass]"
     v-bind="$data.attrs"
  >
    <slot />
  </a>
</template>
