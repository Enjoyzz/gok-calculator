import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'pinia'],
      dts: true,
      vueTemplate: true,
    }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    deps: {
      inline: ['vuetify']
    },
    css: true,
    execArgv: [
      '--localstorage-file',
      resolve(tmpdir(), `vitest-${process.pid}.localstorage`),
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
