import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import checker from 'vite-plugin-checker'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'

import path from 'path'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            MODE: mode,
            VITE_BUILD: process.env.VITE_BUILD
          }
        }
      }),
      checker({
        vueTsc: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,ts,jsx,tsx,html,vue}"'
        },
      }),
      visualizer(),
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/style/main.scss";'
        }
      }
    }
  }
})
