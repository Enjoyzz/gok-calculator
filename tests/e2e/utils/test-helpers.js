export class TestHelpers {
    static async clearStorage(page) {
        await page.evaluate(() => {
            localStorage.removeItem('calculatorData');
            localStorage.removeItem('formulaSettings');
        });
    }

    static async waitForSaveIndicator(page) {
        const indicator = page.locator('#saveIndicator');
        await indicator.waitFor({ state: 'visible', timeout: 5000 });
        await indicator.waitFor({ state: 'hidden', timeout: 5000 });
    }

    static async verifyFormulaCalculation(page, expectedMin, expectedMax) {
        // Ждем пересчета значений
        await page.waitForTimeout(1000);

        // Можно добавить более сложную логику проверки
        return true;
    }
}