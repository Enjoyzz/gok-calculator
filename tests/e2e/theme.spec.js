// tests/e2e/theme.spec.js
import { test, expect } from '@playwright/test';

test.describe('Переключение темы', () => {
  test('должен переключать тему через меню выбора', async ({ page }) => {
    await page.goto('/');

    // Находим кнопку переключения темы (иконка темы в app-bar)
    const themeButton = page.locator('.v-app-bar button').last();
    await expect(themeButton).toBeVisible();

    // Проверяем начальное состояние через классы на html
    const initialThemeClass = await themeButton.getAttribute('class') || '';
    const isInitiallyDark = initialThemeClass.includes('v-theme--dark');
    console.log('Начальная тема кнопки:', initialThemeClass);

    // Открываем меню выбора темы
    await themeButton.click();
    await page.waitForTimeout(300);

    // Проверяем, что меню открылось
    const themeMenu = page.locator('.v-menu .v-overlay__content').last();
    await expect(themeMenu).toBeVisible();

    // Находим пункты меню
    const systemThemeItem = themeMenu.locator('.v-list-item').filter({ hasText: 'Auto' });
    const lightThemeItem = themeMenu.locator('.v-list-item').filter({ hasText: 'Light' });
    const darkThemeItem = themeMenu.locator('.v-list-item').filter({ hasText: 'Dark' });

    await expect(systemThemeItem).toBeVisible();
    await expect(lightThemeItem).toBeVisible();
    await expect(darkThemeItem).toBeVisible();

    // Выбираем темную тему (если текущая светлая) или наоборот
    const currentTheme = initialThemeClass?.includes('theme--dark') ? 'dark' : 'light';
    const targetTheme = currentTheme === 'dark' ? lightThemeItem : darkThemeItem;

    await targetTheme.click();
    await page.waitForTimeout(1000);

    // Проверяем, что тема изменилась
    const newThemeClass = await themeButton.getAttribute('class') || '';
    console.log('Новая тема кнопки:', newThemeClass);

    if (isInitiallyDark) {
      expect(newThemeClass).toContain('v-theme--light');
    } else {
      expect(newThemeClass).toContain('v-theme--dark');
    }

    // Проверяем изменение цвета app-bar через классы bg-
    const appBar = page.locator('.v-toolbar, .v-app-bar').first();
    const appBarClass = await appBar.getAttribute('class') || '';
    console.log('Классы app-bar после переключения:', appBarClass);

// Проверяем, что цвет фона изменился согласно теме
    if (isInitiallyDark) {
      // Была темная тема -> стала светлая
      expect(appBarClass).toContain('bg-blue-grey-lighten-5');
      expect(appBarClass).toContain('v-theme--light');
    } else {
      // Была светлая тема -> стала темная
      expect(appBarClass).toContain('bg-blue-grey-darken-4');
      expect(appBarClass).toContain('v-theme--dark');
    }
  });

  test('должен показывать все три варианта тем в меню', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.locator('.v-app-bar button').last();
    await themeButton.click();
    await page.waitForTimeout(300);

    // Проверяем, что меню открылось
    const themeMenu = page.locator('.v-menu .v-overlay__content').last();
    await expect(themeMenu).toBeVisible();

    // Проверяем все пункты меню
    const menuItems = themeMenu.locator('.v-list-item');
    await expect(menuItems).toHaveCount(3);


    const systemThemeItem = themeMenu.locator('.v-list-item').filter({ hasText: 'Auto' });
    const lightThemeItem = themeMenu.locator('.v-list-item').filter({ hasText: 'Light' });
    const darkThemeItem = themeMenu.locator('.v-list-item').filter({ hasText: 'Dark' });

    // Проверяем наличие иконок
    await expect(systemThemeItem.locator('i')).toBeVisible();
    await expect(lightThemeItem.locator('i')).toBeVisible();
    await expect(darkThemeItem.locator('i')).toBeVisible();
  });

  test('должен сохранять выбранную тему при перезагрузке', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.locator('.v-app-bar button').last();

    // Получаем начальную тему
    const initialThemeClass = await themeButton.getAttribute('class') || '';

    // Открываем меню и выбираем тему, отличную от текущей
    await themeButton.click();
    await page.waitForTimeout(300);

    const themeMenu = page.locator('.v-menu .v-overlay__content').last();

    const initialIsDark = initialThemeClass?.includes('v-theme--dark');
    const targetItem = initialIsDark
      ? themeMenu.locator('.v-list-item:has-text("Light")')
      : themeMenu.locator('.v-list-item:has-text("Dark")');

    await targetItem.click();
    await page.waitForTimeout(1000);

    // Получаем тему после переключения
    const initialThemeClassAfterToggle = await themeButton.getAttribute('class') || '';

    // Перезагружаем страницу
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Проверяем, что тема сохранилась
    const initialThemeClassAfterReload = await themeButton.getAttribute('class') || '';

    expect(initialThemeClassAfterReload).toBe(initialThemeClassAfterToggle);
  });

  test('должен применять системную тему при выборе', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.locator('.v-app-bar button').last();
    const html = page.locator('html');

    // Выбираем системную тему
    await themeButton.click();
    await page.waitForTimeout(300);

    const themeMenu = page.locator('.v-menu .v-overlay__content').last();

    const systemItem = themeMenu.locator('.v-list-item:has-text("Системная")');
    await systemItem.click();
    await page.waitForTimeout(1000);

    // Проверяем, что тема применилась
    const themeAfterSystem = await themeButton.getAttribute('class');
    console.log('Тема после выбора системной:', themeAfterSystem);

    // Тема должна быть либо светлой, либо темной (в зависимости от системных настроек)
    expect(themeAfterSystem).toMatch(/theme--(light|dark)/);
  });
});
