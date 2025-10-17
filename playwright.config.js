// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    outputDir: './test-results/playwright/debug',

    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        actionTimeout: 10000,
        navigationTimeout: 30000,
        // Увеличиваем таймауты для стабильности
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: ['--disable-dev-shm-usage', '--disable-gpu']
                }
            },
        },
    ],

    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },

    retries: process.env.CI ? 2 : 0, // В CI повторяем упавшие тесты

    reporter: [
        ['list'],
        ['html', { outputFolder: './test-results/playwright/html-report' }],
        ['json', { outputFile: './test-results/playwright/test-results.json' }]
    ],
});