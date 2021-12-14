<template functional>
  <div
    class="d-flex align-items-end logo-container"
    :class="data.staticClass || ''"
    v-bind="data.attrs"
  >
    <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="5.74 31.24 123.89 72.89">
      <g transform="matrix(1.0344 0 0 1.0869 -2.068 -181.521)">
        <rect width="5.994" height="23.366" x="9.929" y="224.55" rx="2.997" ry="2.997" />
        <rect width="5.994" height="41.989" x="19.849" y="215.2" rx="2.997" ry="2.819" />
        <rect width="5.994" height="49.213" x="29.768" y="211.49" rx="2.997" ry="2.997" />
        <rect width="5.994" height="58.69" x="39.688" y="202.01" rx="2.997" ry="3.038" />
        <rect width="5.994" height="62.402" x="49.607" y="198.3" rx="2.997" ry="2.997" />
        <rect width="5.994" height="62.733" x="59.526" y="197.97" rx="2.997" ry="2.997" />
        <rect width="5.994" height="58.889" x="69.446" y="201.81" rx="2.997" ry="2.997" />
        <rect width="5.994" height="49.412" x="79.365" y="211.29" rx="2.997" ry="2.997" />
        <rect width="5.994" height="48.948" x="89.285" y="211.75" rx="2.997" ry="2.997" />
        <rect width="5.994" height="44.176" x="99.204" y="216.53" rx="2.997" ry="2.997" />
        <rect width="5.994" height="36.886" x="109.12" y="223.55" rx="2.997" ry="2.997" />
        <rect width="5.994" height="22.372" x="119.04" y="230.78" rx="2.997" ry="2.997" />
      </g>
    </svg>
    <span class="text-body ml-2 text-nowrap">Can't find a name&nbsp; </span>
  </div>
</template>
<style scoped>
svg {
  fill: var(--primary);
  height: 32px;
  margin-bottom: 2px;
}
</style>
