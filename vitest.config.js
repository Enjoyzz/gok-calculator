import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        include: ['tests/unit/**'],
        outputFile: './test-results/vitest-results.json',

        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'html', 'json'],
            reportsDirectory: './test-results/vitest/coverage',
            exclude: [
                'tests/**',
                '**/*.config.js',
                '**/*.d.ts',
                'node_modules/**',
                'dist/**',
                'test-results/**'
            ]
        },
        reporters: [
            'default',
            ['html', { outputFile: './test-results/vitest/vitest-report.html' }],
            ['junit', { outputFile: './test-results/vitest/vitest-results.xml' }]
        ],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    }
})