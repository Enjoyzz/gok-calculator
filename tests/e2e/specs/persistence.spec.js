import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/calculator-page';

test.describe('Сохранение и загрузка данных', () => {
    let calculatorPage;

    test.beforeEach(async ({ page }) => {
        calculatorPage = new CalculatorPage(page);
        await calculatorPage.goto();
    });

    test('автосохранение при изменении данных', async ({ page }) => {
        await calculatorPage.setConcubines(5);
        await calculatorPage.setCharmItem('blueHadak', 3);

        // Ждем появления индикатора сохранения
        const saveIndicator = page.locator('#saveIndicator');
        await expect(saveIndicator).toBeVisible();
        await expect(saveIndicator).toContainText('✓ Данные сохранены');

        // Проверяем localStorage через консоль браузера
        const storageData = await page.evaluate(() => {
            return localStorage.getItem('calculatorData');
        });

        expect(storageData).toContain('"concubines":5');
        expect(storageData).toContain('"blueHadak":3');
    });

    test('восстановление данных после перезагрузки', async ({ page }) => {
        // Устанавливаем данные
        await calculatorPage.setConcubines(2);
        await calculatorPage.setCharmItem('whiteHadak', 8);

        // Перезагружаем страницу
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Проверяем восстановление данных
        const concubinesValue = await calculatorPage.concubinesInput.inputValue();
        const whiteHadakValue = await calculatorPage.charmInputs.whiteHadak.inputValue();

        expect(concubinesValue).toBe('2');
        expect(whiteHadakValue).toBe('8');
    });
});