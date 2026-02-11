// tests/e2e/version-info.spec.js
import {expect, test} from '@playwright/test';

test.describe('VersionInfo', () => {


  test('должен отображать версию в сайдбаре', async ({page}) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const appNavBarIcon =  page.locator('.v-app-bar-nav-icon')

    // Открываем сайдбар если на мобилке
    if (await appNavBarIcon.isVisible()){
      await appNavBarIcon.click();
      await page.waitForTimeout(500);
    }

    const drawer = page.locator('.v-navigation-drawer');
    const badge = page.locator('.v-navigation-drawer .version-badge');

    // Ждем открытия сайдбара
    const initialBox = await drawer.boundingBox();
    expect(initialBox.x).toBeGreaterThanOrEqual(0);

    // Ищем VersionInfo внизу сайдбара

    const openedBadge = await badge.boundingBox();
    expect(openedBadge.x).toBeGreaterThanOrEqual(0); // x >= 0 значит виден

    const versionInfo = badge.first();

    // Проверяем что текст версии есть (может быть "dev", "v1.0.0" и т.д.)
    const versionText = await versionInfo.textContent();
    expect(versionText).toBeTruthy();
    console.log('Версия приложения:', versionText);
  });

  test(
    'должен скрывать/показывать версию при открытии/закрытии сайдбара на мобилке',
    async ({page}) => {


      // Запускаем в мобильном режиме
      await page.setViewportSize({width: 375, height: 667});
      await page.goto('/');

      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('domcontentloaded');

      const drawer = page.locator('.v-navigation-drawer');
      const badge = page.locator('.v-navigation-drawer .version-badge');

      // Проверяем что сайдбар скрыт
      const initialBox = await drawer.boundingBox();
      expect(initialBox.x).toBeLessThan(0); // x отрицательный = за пределами экрана слева

      // Открываем сайдбар
      await page.locator('.v-app-bar-nav-icon').click();
      await page.waitForTimeout(500);
      const openedBox = await drawer.boundingBox();
      expect(openedBox.x).toBeGreaterThanOrEqual(0); // x >= 0 значит виден

      // Проверяем что VersionInfo виден
      const openedBadge = await badge.boundingBox();
      expect(openedBadge.x).toBeGreaterThanOrEqual(0); // x >= 0 значит виден

      // Закрываем сайдбар
      await page.locator('.v-app-bar-nav-icon').click();
      await page.waitForTimeout(500);
      const drawerInitialBox = await drawer.boundingBox();
      expect(drawerInitialBox.x).toBeLessThan(0); // x отрицательный = за пределами экрана слева

      // Проверяем что VersionInfo скрыт
      const badgeInitialBox = await badge.boundingBox();
      expect(badgeInitialBox.x).toBeLessThan(0); // x отрицательный = за пределами экрана слева
    });
});
