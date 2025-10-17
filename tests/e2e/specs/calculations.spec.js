import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/calculator-page';

test.describe('Расчет очков обаяния и близости', () => {
    let calculatorPage;

    test.beforeEach(async ({ page }) => {
        calculatorPage = new CalculatorPage(page);
        await calculatorPage.goto();
    });

    test('расчет обаяния с базовыми значениями', async () => {
        await calculatorPage.setConcubines(1);

        // Устанавливаем значения для обаяния
        await calculatorPage.setCharmItem('blueHadak', 1);
        await calculatorPage.setCharmItem('whiteHadak', 1);
        await calculatorPage.setCharmItem('forage', 100);

        const total = await calculatorPage.getCharmTotal();

        // Проверяем что расчет выполнен (значение больше 0)
        expect(total).toBeGreaterThan(0);

        // Примерная проверка по формуле: 1*1*1.5 + 1*1*1 + 100*1.5 = 1.5 + 1 + 150 = 152.5 ≈ 152
        expect(total).toBeGreaterThan(100);
        expect(total).toBeLessThan(200);
    });

    test('расчет близости с разным количеством наложниц', async () => {
        await calculatorPage.switchToTab('intimacy');

        await calculatorPage.setConcubines(3);
        await calculatorPage.setIntimacyItem('ordos', 2);
        await calculatorPage.setIntimacyItem('takya', 1);
        await calculatorPage.setIntimacyItem('forage', 50);

        const total = await calculatorPage.getIntimacyTotal();

        expect(total).toBeGreaterThan(0);
        // Формула: 2*3*1.5 + 1*3*1 + 50*1.2 = 9 + 3 + 60 = 72
        expect(total).toBeGreaterThan(50);
        expect(total).toBeLessThan(100);
    });

    test('синхронизация фуража между вкладками', async () => {
        // Устанавливаем фураж на вкладке обаяния
        await calculatorPage.setCharmItem('forage', 500);

        // Переключаемся на близость и проверяем значение
        await calculatorPage.switchToTab('intimacy');
        const forageValue = await calculatorPage.intimacyInputs.forage.inputValue();

        expect(forageValue).toBe('500');

        // Меняем на вкладке близости и проверяем обратно
        await calculatorPage.setIntimacyItem('forage', 300);
        await calculatorPage.switchToTab('charm');
        const updatedForageValue = await calculatorPage.charmInputs.forage.inputValue();

        expect(updatedForageValue).toBe('300');
    });
});