declare module 'md5-es';
declare module 'vue-slider-component';
declare module 'icecast-metadata-stats';

declare module 'vue' {
  import { CompatVue } from 'vue'
  const Vue: CompatVue
  export default Vue
  export * from '@vue/runtime-dom'
  const { configureCompat } = Vue
  export { configureCompat }
}
