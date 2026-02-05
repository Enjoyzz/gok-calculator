// tests/e2e/responsive.spec.js
import { test, expect } from '@playwright/test';

test.describe('Мобильная адаптация', () => {
  test('должен показывать/скрывать сайдбар на мобильных устройствах', async ({ page }) => {
    // Мобильный вид
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Проверяем что есть иконка меню
    await expect(page.locator('.v-app-bar-nav-icon')).toBeVisible();

    // Проверяем что сайдбар скрыт (за экраном слева)
    const drawer = page.locator('.v-navigation-drawer');
    const initialBox = await drawer.boundingBox();
    expect(initialBox.x).toBeLessThan(0); // x отрицательный = за пределами экрана слева

    // Открываем сайдбар
    await page.locator('.v-app-bar-nav-icon').click();
    await page.waitForTimeout(500);

    // Проверяем что сайдбар теперь в пределах экрана
    const openedBox = await drawer.boundingBox();
    expect(openedBox.x).toBeGreaterThanOrEqual(0); // x >= 0 значит виден

    // Закрываем сайдбар
    await page.locator('.v-app-bar-nav-icon').click();
    await page.waitForTimeout(500);

    // Проверяем что снова скрыт за экраном
    const closedBox = await drawer.boundingBox();
    expect(closedBox.x).toBeLessThan(0);

    // Десктопный вид
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // На десктопе сайдбар должен быть виден (x >= 0)
    const desktopBox = await drawer.boundingBox();
    expect(desktopBox.x).toBeGreaterThanOrEqual(0);

    // На десктопе иконка меню не должна быть видна
    await expect(page.locator('.v-app-bar-nav-icon')).toBeHidden();
  });
});
