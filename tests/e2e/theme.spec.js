// tests/e2e/theme.spec.js
import { test, expect } from '@playwright/test';

test.describe('Переключение темы', () => {
  test('должен переключать тему с светлой на темную', async ({ page }) => {
    await page.goto('/');

    // Находим кнопку переключения темы
    const themeButton = page.locator('.v-app-bar button').last();
    await expect(themeButton).toBeVisible();

    // Проверяем начальную тему через CSS переменные (Vuetify 3)
    const initialBgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
      .getPropertyValue('--v-theme-background')
      .trim();
    });
    console.log('Начальный фон:', initialBgColor);

    // Проверяем атрибуты темы
    const themeElement = page.locator('[data-v-theme], .v-theme--light, .v-theme--dark').first();
    const initialThemeAttr = await themeElement.getAttribute('data-v-theme') ||
      await themeElement.getAttribute('class');
    console.log('Начальные атрибуты темы:', initialThemeAttr);

    // Кликаем для переключения темы
    await themeButton.click();
    await page.waitForTimeout(1000);

    // Проверяем что тема изменилась через CSS переменные
    const newBgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
      .getPropertyValue('--v-theme-background')
      .trim();
    });
    console.log('Новый фон:', newBgColor);

    // Проверяем изменение атрибутов
    const newThemeAttr = await themeElement.getAttribute('data-v-theme') ||
      await themeElement.getAttribute('class');
    console.log('Новые атрибуты темы:', newThemeAttr);

    // Утверждаем что тема изменилась (фон должен измениться)
    expect(newBgColor).not.toBe(initialBgColor);
  });

  test('должен сохранять тему при перезагрузке', async ({ page }) => {
    await page.goto('/');

    // Находим кнопку темы
    const themeButton = page.locator('.v-app-bar button').last();
    await expect(themeButton).toBeVisible();

    // Переключаем тему
    await themeButton.click();
    await page.waitForTimeout(1000);

    // Запоминаем текущую тему
    const html = page.locator('html');
    const themeAfterToggle = await html.getAttribute('class');
    console.log('Тема после переключения:', themeAfterToggle);

    // Перезагружаем страницу
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Проверяем что тема сохранилась
    const themeAfterReload = await html.getAttribute('class');
    console.log('Тема после перезагрузки:', themeAfterReload);

    expect(themeAfterReload).toBe(themeAfterToggle);
  });
});
