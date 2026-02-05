import { test, expect } from '@playwright/test';

test.describe('BottomNavigation Component', () => {
  test.describe('Калькуляторы без настроек (мясо, серебро, солдаты)', () => {
    const calculatorsWithoutSettings = ['/dev/meat', '/dev/silver', '/dev/soldiers'];

    for (const url of calculatorsWithoutSettings) {
      test(`не должен показывать кнопку настроек на ${url}`, async ({ page }) => {
        await page.goto(url);

        // Проверяем, что нет кнопки с иконкой cog
        await expect(page.locator('.v-bottom-navigation button:has(i-mdi-cog)')).toBeHidden();

        // Проверяем, что есть только сумма
        await expect(page.locator('.v-bottom-navigation .v-card-title')).toBeVisible();
      });
    }
  });

  test.describe('Калькуляторы с настройками (обаяние, близость)', () => {
    const calculatorsWithSettings = ['/dev/charm', '/dev/intimacy'];

    for (const url of calculatorsWithSettings) {
      test(`должен показывать кнопку настроек на ${url}`, async ({ page }) => {
        await page.goto(url);

        const buttons = page.locator('.v-bottom-navigation button');
        await buttons.first().waitFor({ state: 'visible', timeout: 15000 });

        await expect(buttons).toHaveCount(1); // Ожидаем одну кнопку

        // Проверяем, что кнопка видима
        await expect(buttons.first()).toBeVisible();

        // Можно проверить наличие иконки в кнопке
        const buttonIcon = buttons.first().locator('i, svg, img');
        await expect(buttonIcon).toBeVisible();
      });

      test(`должен открывать/закрывать диалог настроек на ${url}`, async ({ page }) => {
        await page.goto(url);

        // Открываем диалог
        const buttons = page.locator('.v-bottom-navigation button');
        await buttons.first().waitFor({ state: 'visible', timeout: 15000 });
        await buttons.first().click();
        await page.waitForTimeout(500);
        const dialog = page.locator('.v-dialog')
        await expect(dialog).toBeVisible();
        await expect(dialog.getByText('Настройки')).toBeVisible();

        // Закрываем диалог
        await page.locator('.v-dialog .v-card-actions button:has-text("Закрыть")').click();
        await page.waitForTimeout(500);
        await expect(page.locator('.v-dialog')).toBeHidden();
      });

      test(`должен сохранять настройки на ${url}`, async ({ page }) => {
        await page.goto(url);

        // Открываем диалог
        const buttons = page.locator('.v-bottom-navigation button');
        await buttons.first().waitFor({ state: 'visible', timeout: 15000 });
        await buttons.first().click();
        await page.waitForTimeout(500);

        // Находим первый input и изменяем значение
        const dialog = page.locator('.v-dialog');
        const input = dialog.locator('input[type="number"]').first();
        await input.clear();
        await input.fill('2.5');

        // Сохраняем
        await page.locator('.v-card-actions button:has-text("Сохранить")').click();
        await page.waitForTimeout(500);
        await expect(dialog).toBeHidden();

        // Проверяем, что значение сохранилось (открываем снова)
        await buttons.first().click();
        await page.waitForTimeout(500);
        await expect(dialog).toBeVisible();

        // Значение должно быть 2.5
        await expect(input).toHaveValue('2.5');
      });

      test(`должен сбрасывать значение на дефолтное на ${url}`, async ({ page }) => {
        await page.goto(url);

        // Открываем диалог
        const buttons = page.locator('.v-bottom-navigation button');
        await buttons.first().waitFor({ state: 'visible', timeout: 15000 });
        await buttons.first().click();
        await page.waitForTimeout(500);

        // Находим первый input
        const dialog = page.locator('.v-dialog');
        const input = dialog.locator('input[type="number"]').first();
        const initialValue = await input.inputValue();

        // Изменяем значение
        await input.fill('3.0');
        await expect(input).toHaveValue('3.0');

        // Нажимаем кнопку очистки (clearable)
        const clearButton = dialog.getByRole('button', { name: 'Clear' }).first();
        await clearButton.click();
        await page.waitForTimeout(500);

        // Проверяем, что значение сбросилось на изначальное
        await expect(input).toHaveValue(initialValue);
      });

      test(`должен показывать предупреждение при изменённом значении на ${url}`, async ({ page }) => {
        await page.goto(url);

        // Открываем диалог
        const buttons = page.locator('.v-bottom-navigation button');
        await buttons.first().waitFor({ state: 'visible', timeout: 15000 });
        await buttons.first().click();
        await page.waitForTimeout(500);

        // Находим первый input
        const dialog = page.locator('.v-dialog');
        const input = dialog.locator('input[type="number"]').first();

        // Изменяем значение
        await input.fill('3.0');

        // Проверяем подсветку (у Vuetify меняется класс или стиль)
        await expect(dialog.locator('.text-error:has-text("Внимание! Был изменён множитель!")')).toBeVisible();

      });

      test(`должен сбрасывать значение на дефолтное при отмене или закрытии окна с изменениями на ${url}`, async ({ page }) => {
        await page.goto(url);

        // Открываем диалог
        const buttons = page.locator('.v-bottom-navigation button');
        await buttons.first().waitFor({ state: 'visible', timeout: 15000 });
        await buttons.first().click();
        await page.waitForTimeout(500);

        // Находим первый input
        const dialog = page.locator('.v-dialog');
        const input = dialog.locator('input[type="number"]').first();
        const initialValue = await input.inputValue();

        // Изменяем значение
        await input.fill('3.0');
        await expect(input).toHaveValue('3.0');

        // Закрываем диалог через кнопку "Закрыть"
        await dialog.locator('.v-card-actions button:has-text("Закрыть")').click();
        await page.waitForTimeout(500);
        await expect(dialog).toBeHidden();

        // Проверяем, что значение сохранилось (открываем снова)
        await buttons.first().click();
        await page.waitForTimeout(500);
        await expect(dialog).toBeVisible();

        // Значение должно быть 2.5
        await expect(input).toHaveValue(initialValue);
      });
    }
  });
});
