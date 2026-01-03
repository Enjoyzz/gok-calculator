import { test, expect } from '@playwright/test'

test.describe('Settings Modal from multiplier click', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
        await page.waitForSelector('h1:has-text("Калькулятор ресурсов")')
    })

    test('should open settings modal when clicking on blueHadak multiplier', async ({ page }) => {
        // 1. Убедимся что на вкладке Обаяние
        const charmTab = page.locator('div.tab:has-text("Обаяние")')
        await charmTab.click()

        // 2. Находим множитель Синего хадака по data-testid
        const blueHadakMultiplier = page.locator('[data-testid="multiplier-blueHadak"]')
        await expect(blueHadakMultiplier).toBeVisible()
        await expect(blueHadakMultiplier).toContainText('×')

        // 3. Кликаем
        await blueHadakMultiplier.click()

        // 4. Проверяем модалку
        const modal = page.locator('#settings-modal')
        await expect(modal).toBeVisible()

        // 5. Проверяем что открылась нужная секция
        await expect(page.locator('#settings-modal')).toContainText('Обаяние')
        await expect(page.locator('#settings-modal')).toContainText('Синий хадак')
    })

    test('should open settings modal when clicking on silverHairpin multiplier', async ({ page }) => {
        await page.locator('div.tab:has-text("Обаяние")').click()

        const silverHairpinMultiplier = page.locator('[data-testid="multiplier-silverHairpin"]')
        await expect(silverHairpinMultiplier).toBeVisible()
        await silverHairpinMultiplier.click()

        await expect(page.locator('#settings-modal')).toBeVisible()
        await expect(page.locator('#settings-modal')).toContainText('Серебряная шпилька')
    })

    test('should open settings modal when clicking on ordos multiplier in intimacy tab', async ({ page }) => {
        // 1. Переходим на вкладку Близость
        await page.locator('div.tab:has-text("Близость")').click()

        // 2. Кликаем на множитель Ордоса
        const ordosMultiplier = page.locator('[data-testid="multiplier-ordos"]')
        await expect(ordosMultiplier).toBeVisible()
        await ordosMultiplier.click()

        // 3. Проверяем модалку
        await expect(page.locator('#settings-modal')).toBeVisible()
        await expect(page.locator('#settings-modal')).toContainText('Близость')
        await expect(page.locator('#settings-modal')).toContainText('Ордос')
    })

    test('should open settings modal when clicking on sandalwoodBracelet multiplier', async ({ page }) => {
        await page.locator('div.tab:has-text("Близость")').click()

        const braceletMultiplier = page.locator('[data-testid="multiplier-sandalwoodBracelet"]')
        await expect(braceletMultiplier).toBeVisible()
        await braceletMultiplier.click()

        await expect(page.locator('#settings-modal')).toBeVisible()
        await expect(page.locator('#settings-modal')).toContainText('Сандаловый браслет')
    })

    test('should update multiplier value after saving settings', async ({ page }) => {
        // 1. Открываем модалку через множитель
        await page.locator('div.tab:has-text("Обаяние")').click()
        await page.locator('[data-testid="multiplier-blueHadak"]').click()

        // 2. Меняем значение
        const blueHadakInput = page.locator('#settings-modal input[min="1"][max="3"]').first()
        await blueHadakInput.fill('2.5')

        // 3. Сохраняем
        await page.locator('#settings-modal button:has-text("Сохранить")').click()

        // 4. Ждем закрытия модалки
        await expect(page.locator('#settings-modal')).not.toBeVisible()

        // 5. Проверяем, что множитель обновился
        await expect(page.locator('[data-testid="multiplier-blueHadak"]')).toContainText('×2.5')
    })

    test('should not open settings modal when clicking multiplier in shared view', async ({ page }) => {
        // 1. Создаем shared ссылку с данными
        const shareData = {
            calculatorData: {
                concubines: 3,
                blueHadak: 10,
                silverHairpin: 5,
                chests: 0,
                forage: 0,
                whiteHadak: 0,
                ordos: 8,
                sandalwoodBracelet: 3
            },
            formulaSettings: {
                charm: {
                    blueHadak: 2.0,
                    silverHairpin: 4,
                    chests: 3.0,
                    forage: 2.0
                },
                intimacy: {
                    ordos: 2.0,
                    sandalwoodBracelet: 4,
                    forage: 1.5
                }
            }
        }

        const encoded = btoa(JSON.stringify(shareData))

        // 2. Переходим по shared ссылке
        await page.goto(`/?share=${encoded}`)
        await page.waitForLoadState('networkidle')

        // 3. Проверяем что баннер shared view виден
        await expect(page.locator('.readonly-banner')).toBeVisible()
        await expect(page.locator('.readonly-banner')).toContainText('Просмотр чужих данных')

        // 4. Переходим на вкладку Обаяние
        await page.locator('div.tab:has-text("Обаяние")').click()

        // 5. Находим множитель синего хадака
        const blueHadakMultiplier = page.locator('[data-testid="multiplier-blueHadak"]')
        await expect(blueHadakMultiplier).toBeVisible()

        // 6. Кликаем на множитель
        await blueHadakMultiplier.click()

        // 7. Проверяем что модалка НЕ открылась
        const settingsModal = page.locator('#settings-modal')
        await expect(settingsModal).not.toBeVisible()

        // 8. Проверяем что кнопка "Настройки формул" не видна
        const settingsButton = page.locator('button:has-text("Настройки формул")')
        await expect(settingsButton).not.toBeVisible()

        // 9. Проверяем что инпут количества наложниц disabled
        const concubinesInput = page.locator('input[type="number"]').first()
        await expect(concubinesInput).toBeDisabled()
    })

    test('should not show settings buttons in shared view at all', async ({ page }) => {
        const shareData = {
            calculatorData: { concubines: 3 },
            formulaSettings: {
                charm: { blueHadak: 1.0 },
                intimacy: { ordos: 1.0 }
            }
        }

        const encoded = btoa(JSON.stringify(shareData))

        await page.goto(`/?share=${encoded}`)
        await page.waitForLoadState('networkidle')

        // Проверяем что все кнопки настроек отсутствуют
        const allSettingsButtons = page.locator('button:has-text("Настройки")')
        await expect(allSettingsButtons).toHaveCount(0)

        // Проверяем что кнопка "Сбросить настройки" отсутствует
        const resetButton = page.locator('button:has-text("Сбросить настройки")')
        await expect(resetButton).not.toBeVisible()

        // Проверяем что блок .settings-buttons отсутствует
        const settingsButtonsDiv = page.locator('.settings-buttons')
        await expect(settingsButtonsDiv).not.toBeVisible()
    })

    test('should allow returning from shared view to own data', async ({ page }) => {
        const shareData = {
            calculatorData: { concubines: 5 },
            formulaSettings: { charm: { blueHadak: 2.0 } }
        }

        const encoded = btoa(JSON.stringify(shareData))

        await page.goto(`/?share=${encoded}`)
        await page.waitForLoadState('networkidle')

        // 1. Проверяем что в shared view
        await expect(page.locator('.readonly-banner')).toBeVisible()

        // 2. Кликаем на ссылку "Вернутся к себе"
        const returnLink = page.locator('.readonly-banner a:has-text("Вернутся к себе")')
        await expect(returnLink).toBeVisible()
        await returnLink.click()

        // 3. Проверяем что shared view убран
        await expect(page.locator('.readonly-banner')).not.toBeVisible()

        // 4. Проверяем что кнопки настроек появились
        const settingsButton = page.locator('button:has-text("Настройки формул")')
        await expect(settingsButton).toBeVisible()

        // 5. Проверяем что инпут enabled
        const concubinesInput = page.locator('input[type="number"]').first()
        await expect(concubinesInput).toBeEnabled()

        // 6. Теперь можно кликнуть на множитель и открыть модалку
        await page.locator('div.tab:has-text("Обаяние")').click()

        const multiplier = page.locator('[data-testid="multiplier-blueHadak"]').first()
        await multiplier.click()

        await expect(page.locator('#settings-modal')).toBeVisible()
    })

})