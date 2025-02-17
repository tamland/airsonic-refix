import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'
import checker from 'vite-plugin-checker'
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'

export default defineConfig({
  plugins: [
    vue(),
    checker({
      vueTsc: true,
      eslint: {
        lintCommand: 'eslint . --ext .vue,.ts,.js --ignore-path .gitignore',
      },
    }),
    bundleAnalyzer({
      analyzerMode: 'static',
      reportFilename: 'report.html'
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      }
    },
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  }
})
