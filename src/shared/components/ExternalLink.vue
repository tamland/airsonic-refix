<template functional>
  <a :href="props.href"
     target="_blank"
     rel="noopener noreferrer"
     :class="[data.class, data.staticClass]">
    <slot />
  </a>
</template>
