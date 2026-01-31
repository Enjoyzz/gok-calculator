import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import removeConsole from "vite-plugin-remove-console";
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from "@primevue/auto-import-resolver";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        removeConsole({
            includes: ['log', 'warn', 'debug', 'info']
        }),
        Components({
            resolvers: [
                PrimeVueResolver()
            ]
        })
    ],
    base: '/gok-calculator/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
