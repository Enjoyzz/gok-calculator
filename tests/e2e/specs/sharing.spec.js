import { test, expect } from '@playwright/test'

test.describe('Sharing functionality', () => {
    test('should generate share link and open modal', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // Нажать кнопку поделиться
        await page.click('button:has-text("Поделиться")')

        // Проверить что модалка открылась (ваш заголовок "Поделиться")
        await expect(page.locator('h3:has-text("Поделиться")')).toBeVisible()

        // Проверить что ссылка сгенерировалась
        const shareInput = page.locator('.link-input')
        await expect(shareInput).toBeVisible()
        const value = await shareInput.inputValue()
        expect(value).toMatch(/\?share=/)
    })

    test('should copy share link to clipboard', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // Mock clipboard API перед открытием страницы или в контексте
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'clipboard', {
                value: {
                    writeText: () => Promise.resolve()
                },
                writable: true
            })
        })

        // Перезагружаем страницу с mock
        await page.reload()
        await page.waitForLoadState('networkidle')

        // Открыть модалку
        await page.click('button:has-text("Поделиться")')
        await expect(page.locator('h3:has-text("Поделиться")')).toBeVisible()

        const copyButton = page.locator('.copy-btn')
        await copyButton.click()
        await expect(copyButton).toHaveText('Скопировано!')
    })

    test('should display readonly banner in shared view', async ({ page }) => {
        // Создать shared ссылку
        const shareData = {
            calculatorData: { concubines: 3, blueHadak: 10 },
            formulaSettings: { charm: { blueHadak: 1.5 } }
        }
        const encoded = btoa(JSON.stringify(shareData))

        await page.goto(`/?share=${encoded}`)
        await page.waitForLoadState('networkidle')

        // Проверить баннер (используем класс)
        await expect(page.locator('.readonly-banner')).toBeVisible()

        // Проверить что данные загрузились
        const concubinesInput = page.locator('input[type="number"]').first()
        await expect(concubinesInput).toHaveValue('3')
    })

    test('should disable inputs in shared view', async ({ page }) => {
        const shareData = {
            calculatorData: { concubines: 3, blueHadak: 0, whiteHadak: 0 },
            formulaSettings: { charm: { blueHadak: 1.5 } }
        }
        const encoded = btoa(JSON.stringify(shareData))

        await page.goto(`/?share=${encoded}`)
        await page.waitForLoadState('networkidle')

        // Проверить баннер
        await expect(page.locator('.readonly-banner')).toBeVisible()

        // Найти input для количества наложниц (первый input на странице)
        const concubinesInput = page.locator('input[type="number"]').first()

        // Проверить что он disabled или имеет класс readonly
        const isDisabled = await concubinesInput.isDisabled()
        const hasReadonlyClass = await concubinesInput.evaluate(el => el.classList.contains('readonly-input'))

        expect(isDisabled || hasReadonlyClass).toBeTruthy()

        // Проверить что кнопка настроек скрыта
        await expect(page.locator('button:has-text("Настройки")')).not.toBeVisible()
    })

    test('should not show share button in shared view', async ({ page }) => {
        const shareData = { calculatorData: { concubines: 3 } }
        const encoded = btoa(JSON.stringify(shareData))

        await page.goto(`/?share=${encoded}`)
        await page.waitForLoadState('networkidle')

        // Кнопка поделиться должна быть скрыта в shared режиме
        await expect(page.locator('button:has-text("Поделиться")')).not.toBeVisible()
    })

    test('should handle invalid share data gracefully', async ({ page }) => {
        await page.goto('/?share=invalid_base64_data')

        await expect(page.locator('.modal-overlay:has-text("Некорректная ссылка")')).toBeVisible()

        await expect(page.locator('.modal-content h3:has-text("Некорректная ссылка")')).toBeVisible()
        await expect(page.locator('.modal-content p:has-text("Ссылка содержит некорректные данные")')).toBeVisible()

        await page.click('.modal-content .confirm-btn')

        await expect(page.locator('.modal-overlay')).not.toBeVisible()

        await expect(page.locator('h1:has-text("Калькулятор обаяния и близости")')).toBeVisible()

        await expect(page.locator('.readonly-banner')).not.toBeVisible()

        await expect(page.locator('input[type="number"]').first()).toBeEnabled()
    })

    test('should use formulas from shared data', async ({ page }) => {
        const customFormulas = {
            charm: { blueHadak: 2.0, silverHairpin: 4, chests: 3.0, forage: 2.0 },
            intimacy: { ordos: 2.0, sandalwoodBracelet: 4, forage: 1.5 }
        }

        const shareData = {
            calculatorData: { concubines: 1, blueHadak: 10 },
            formulaSettings: customFormulas
        }
        const encoded = btoa(JSON.stringify(shareData))

        await page.goto(`/?share=${encoded}`)
        await page.waitForLoadState('networkidle')

        // Уточнить локатор для конкретной строки Синего хадака
        await expect(page.locator('tr:has-text("Синий хадак") td:has-text("20")')).toBeVisible()

        // ИЛИ использовать более точный селектор по порядку
        await expect(page.locator('table tr:nth-child(1) td:has-text("20")')).toBeVisible()

        await expect(page.locator('li:has-text("Синий хадак: количество × количество наложниц × 2")')).toBeVisible()
    })
})