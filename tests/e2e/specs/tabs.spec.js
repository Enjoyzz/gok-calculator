import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/calculator-page';

test.describe('Переключение между вкладками', () => {
    let calculatorPage;

    test.beforeEach(async ({ page }) => {
        calculatorPage = new CalculatorPage(page);
        await calculatorPage.goto();
    });

    test('переключение на вкладку близости', async () => {
        await calculatorPage.switchToTab('intimacy');

        // Проверяем что отображаются элементы близости
        await expect(calculatorPage.intimacyInputs.ordos).toBeVisible();
        await expect(calculatorPage.intimacyInputs.takya).toBeVisible();

        // Проверяем активность вкладки
        await expect(calculatorPage.intimacyTab).toHaveClass(/active/);
        await expect(calculatorPage.charmTab).not.toHaveClass(/active/);
    });

    test('сохранение данных при переключении вкладок', async () => {
        // Вводим данные на вкладке обаяния
        await calculatorPage.setCharmItem('blueHadak', 5);
        await calculatorPage.setCharmItem('perfume', 10);

        // Переключаемся и возвращаемся
        await calculatorPage.switchToTab('intimacy');
        await calculatorPage.switchToTab('charm');

        // Проверяем сохранение значений
        const blueHadakValue = await calculatorPage.charmInputs.blueHadak.inputValue();
        const perfumeValue = await calculatorPage.charmInputs.perfume.inputValue();

        expect(blueHadakValue).toBe('5');
        expect(perfumeValue).toBe('10');
    });
});