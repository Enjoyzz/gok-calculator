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
    include: ['tests/unit/**'],
    exclude: ['./tests/unit/setup.js'],
    outputFile: './test-results/vitest-results.json',
    setupFiles: ['./tests/unit/setup.js'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './test-results/vitest/coverage',
      exclude: [
        'tests/**',
        'tests/setup.js',
        '**/*.config.js',
        '**/*.d.ts',
        'node_modules/**',
        'dist/**',
        'test-results/**'
      ]
    },
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
