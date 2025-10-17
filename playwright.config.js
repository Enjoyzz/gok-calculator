import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,

    // Явно указываем где искать тесты
    testMatch: '**/*.spec.{js,ts}',

    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        actionTimeout: 10000,
        navigationTimeout: 30000,
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

    retries: process.env.CI ? 2 : 1,

    // Для отладки - выводим больше информации
    reporter: [
        ['list'],
        ['html']
    ],
});