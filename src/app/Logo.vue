<template>
  <div class="d-flex align-items-end logo-container"
       :class="$data.staticClass || ''"
       v-bind="$data.attrs"
       style="height: auto; display: flex;">
    <img src="/laterna_logo.png" alt="Logo" style="height: 100px; width: auto;">
  </div>
</template>
