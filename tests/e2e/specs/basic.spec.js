import { test, expect } from '@playwright/test';

test('базовый тест - проверка загрузки приложения', async ({ page }) => {
    console.log('Запуск базового теста...');

    await page.goto('/');

    // Ждем загрузки страницы
    await page.waitForLoadState('networkidle');

    // Проверяем что страница загрузилась
    await expect(page).toHaveURL(/http:\/\/localhost:5173/);

    // Проверяем что body не пустой
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();

    console.log('Содержимое body:', bodyContent?.substring(0, 100) + '...');

    // Делаем скриншот для диагностики
    await page.screenshot({ path: 'tests/e2e/debug-screenshot.png' });
    console.log('Скриншот сохранен: tests/e2e/debug-screenshot.png');
});

test('проверка наличия элементов калькулятора', async ({ page }) => {
    await page.goto('/');

    // Ищем различные возможные элементы калькулятора
    const possibleSelectors = [
        'button',
        'input',
        'select',
        '[data-testid]',
        '.calculator',
        '.container',
        'form'
    ];

    for (const selector of possibleSelectors) {
        const elements = await page.locator(selector).count();
        if (elements > 0) {
            console.log(`Найдено ${elements} элементов с селектором: ${selector}`);
        }
    }

    // Проверяем наличие каких-либо интерактивных элементов
    const buttons = await page.locator('button').count();
    const inputs = await page.locator('input').count();

    console.log(`Всего кнопок: ${buttons}, инпутов: ${inputs}`);

    expect(buttons + inputs).toBeGreaterThan(0);
});