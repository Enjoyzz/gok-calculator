import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/calculator-page';

test.describe('Настройка формул', () => {
    let calculatorPage;

    test.beforeEach(async ({ page }) => {
        calculatorPage = new CalculatorPage(page);
        await calculatorPage.goto();
    });

    test('изменение множителя синего хадака', async () => {
        await calculatorPage.openSettings();

        // Находим input для синего хадака по метке
        const blueHadakInput = calculatorPage.page.locator('span').filter({ hasText: 'Синий хадак (множитель)' }).locator('..').locator('input');

        // Меняем значение
        await blueHadakInput.fill('2.5');
        await calculatorPage.saveSettings();

        // Проверяем применение новой формулы
        await calculatorPage.setConcubines(1);
        await calculatorPage.setCharmItem('blueHadak', 2);

        const total = await calculatorPage.getCharmTotal();

        // С новым множителем: 2*1*2.5 = 5 (вместо 3 со старым множителем 1.5)
        expect(total).toBeGreaterThan(4);
    });

    test('сброс настроек к значениям по умолчанию', async ({ page }) => {


        await calculatorPage.openSettings();

        // Меняем значение
        const blueHadakInput = calculatorPage.page.locator('span').filter({ hasText: 'Синий хадак (множитель)' }).locator('..').locator('input');
        await blueHadakInput.fill('2.0');
        await calculatorPage.saveSettings();

        await calculatorPage.resetSettingsWithConfirmation()

        // Проверяем сообщение о сбросе
        const saveIndicator = page.locator('#saveIndicator');
        await expect(saveIndicator).toContainText('✓ Настройки сброшены');
    });
});