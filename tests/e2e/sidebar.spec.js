// tests/e2e/sidebar.spec.js
import { test, expect } from '@playwright/test';

test.describe('Sidebar навигация', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Открываем сайдбар если на мобилке
    if (await page.locator('.v-app-bar-nav-icon').isVisible()) {
      await page.locator('.v-app-bar-nav-icon').click();
      await page.locator('.v-navigation-drawer').waitFor({ state: 'visible' });
    }
  });

  test('должен отображать все калькуляторы в сайдбаре', async ({ page }) => {
    // Проверяем заголовок
    await expect(page.locator('.v-navigation-drawer', { hasText: 'РАСЧЕТЫ' })).toBeVisible();

    const calculators = [
      'Обаяние',
      'Близость',
      'Мясо',
      'Серебро',
      'Солдаты'
    ];

    for (const calc of calculators) {
      await expect(page.locator('.v-navigation-drawer a:has-text("' + calc + '")').first()).toBeVisible();
    }
  });

  test('должен переходить по калькуляторам', async ({ page }) => {
    // Кликаем на калькулятор мяса
    await page.locator('.v-navigation-drawer a:has-text("Мясо")').first().click();

    // Ждем загрузки калькулятора
    await expect(page.locator('.v-card-title:has-text("Калькулятор мяса")').first()).toBeVisible();

    // Проверяем поле ввода
    const meatInput = page.locator('input[type="number"][min="0"]').first();
    await expect(meatInput).toBeVisible();

    // Переходим к серебру через сайдбар
    // Сначала открываем сайдбар если нужно
    if (await page.locator('.v-app-bar-nav-icon').isVisible()) {
      await page.locator('.v-app-bar-nav-icon').click();
      await page.locator('.v-navigation-drawer').waitFor({ state: 'visible' });
    }

    await page.locator('.v-navigation-drawer a:has-text("Серебро")').first().click();

    // Проверяем серебро
    await expect(page.locator('.v-card-title:has-text("Калькулятор серебра")').first()).toBeVisible();

    const silverInput = page.locator('input[type="number"][min="0"]').first();
    await expect(silverInput).toBeVisible();
  });
});
