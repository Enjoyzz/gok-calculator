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


test.describe('Settings Modal Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => {
            window.formulas = {
                charm: {
                    blueHadak: 1.5,
                    silverHairpin: 2.0,
                    chests: 1.0,
                    forage: 1.0
                },
                intimacy: {
                    ordos: 1.5,
                    sandalwoodBracelet: 2.0,
                    forage: 1.0
                }
            };
        });
    });

    test('should validate number fields with min/max constraints', async ({ page }) => {
        await page.click('button:has-text("Настройки формул")');
        await expect(page.locator('#settings-modal')).toBeVisible();

        // Используем более точные локаторы
        const blueHadakInput = page.locator('.settings-input[min="1"][max="3"]').first();

        // Тест 1: Ввод значения больше максимума
        await blueHadakInput.fill('5');
        await blueHadakInput.blur();
        await expect(blueHadakInput).toHaveJSProperty('validity.valid', false);

        // Тест 2: Ввод значения меньше минимума
        await blueHadakInput.fill('0.5');
        await blueHadakInput.blur();
        await expect(blueHadakInput).toHaveJSProperty('validity.valid', false);

        // Тест 3: Ввод корректного значения
        await blueHadakInput.fill('2.5');
        await blueHadakInput.blur();
        await expect(blueHadakInput).toHaveJSProperty('validity.valid', true);

        // Тест 4: Попытка сохранения с невалидными данными
        // Сначала делаем одно поле невалидным
        await blueHadakInput.fill('0');
        await page.click('button:has-text("Сохранить")');
        await expect(page.locator('#settings-modal')).toBeVisible();
    });

    test('should save when all fields are valid', async ({ page }) => {
        await page.click('button:has-text("Настройки формул")');

        // Заполняем все поля валидными значениями через форму
        const inputs = page.locator('#settings-modal .settings-input');
        const count = await inputs.count();

        for (let i = 0; i < count; i++) {
            const input = inputs.nth(i);
            const min = parseFloat(await input.getAttribute('min') || '0');
            const maxAttr = await input.getAttribute('max');
            const max = maxAttr ? parseFloat(maxAttr) : min + 5; // дефолтный максимум
            const validValue = Math.max(min, Math.min(max, min + 1)); // гарантированно валидное значение

            await input.fill(validValue.toString());
            await input.blur();

            // Ждем немного и проверяем валидность
            await page.waitForTimeout(100);
            const isValid = await input.evaluate(el => el.checkValidity());
            expect(isValid).toBe(true);
        }

        // Сохраняем
        await page.click('button:has-text("Сохранить")');
        await expect(page.locator('#settings-modal')).not.toBeVisible();
    });

    test('should validate on blur', async ({ page }) => {
        await page.click('button:has-text("Настройки формул")');

        // Используем конкретный класс settings-input
        const input = page.locator('.settings-input[min="1"][max="3"]').first();

        // Вводим невалидное значение
        await input.fill('0');
        await input.blur();
        await page.waitForTimeout(100);

        // Проверяем, что сработала валидация
        const isValidAfterInvalid = await input.evaluate(el => el.checkValidity());
        expect(isValidAfterInvalid).toBe(false);

        // Исправляем на валидное
        await input.fill('2');
        await input.blur();
        await page.waitForTimeout(100);

        // Проверяем, что теперь валидно
        const isValidAfterValid = await input.evaluate(el => el.checkValidity());
        expect(isValidAfterValid).toBe(true);
    });

    test('should validate required fields', async ({ page }) => {
        await page.click('button:has-text("Настройки формул")');

        // Очищаем обязательное поле
        const requiredInput = page.locator('.settings-input[required]').first();
        await requiredInput.fill('');
        await requiredInput.blur();
        await page.waitForTimeout(100);

        // Проверяем, что поле невалидно
        const isValid = await requiredInput.evaluate(el => el.checkValidity());
        expect(isValid).toBe(false);

        const valueMissing = await requiredInput.evaluate(el => el.validity.valueMissing);
        expect(valueMissing).toBe(true);
    });
});