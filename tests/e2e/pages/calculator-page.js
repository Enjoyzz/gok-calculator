export class CalculatorPage {
    constructor(page) {
        this.page = page;

        // Основные элементы
        this.concubinesInput = page.locator('input[type="number"]').first();
        this.calculator = page.locator('.calculator');

        // Вкладки
        this.charmTab = page.locator('.tab').filter({ hasText: 'Обаяние' });
        this.intimacyTab = page.locator('.tab').filter({ hasText: 'Близость' });

        // Кнопки настроек
        this.settingsButton = page.locator('button').filter({ hasText: 'Настройки формул' });
        this.resetButton = page.locator('button').filter({ hasText: 'Сбросить настройки' });

        // Элементы обаяния
        this.charmInputs = {
            blueHadak: this.getInputForItem('Синий хадак'),
            whiteHadak: this.getInputForItem('Белый хадак'),
            goldHairpin: this.getInputForItem('Золотая шпилька'),
            silverHairpin: this.getInputForItem('Серебряная шпилька'),
            perfume: this.getInputForItem('Османтусовые духи'),
            chests: this.getInputForItem('Сундук странствий'),
            forage: this.getInputForItem('Фураж')
        };

        // Элементы близости
        this.intimacyInputs = {
            ordos: this.getInputForItem('Ордос'),
            takya: this.getInputForItem('Такъя'),
            jadeBracelet: this.getInputForItem('Нефритовый браслет'),
            sandalwoodBracelet: this.getInputForItem('Сандаловый браслет'),
            goldEarrings: this.getInputForItem('Золотые серьги'),
            gemRing: this.getInputForItem('Самоцветное кольцо'),
            loveLetter: this.getInputForItem('Любовное письмо'),
            forage: this.getInputForItem('Фураж')
        };

        // Результаты
        this.charmTotal = page.locator('td').filter({ hasText: 'ИТОГ' }).locator('..').locator('td').nth(4);
        this.intimacyTotal = page.locator('td').filter({ hasText: 'ИТОГ' }).locator('..').locator('td').nth(4);

        // Модальное окно настроек
        this.settingsModal = page.locator('#settings-modal');
        this.charmFormulaInputs = {
            blueHadak: page.locator('input').filter({ hasText: '' }).locator('..').locator('input').first(), // Будем уточнять
        };
    }

    async goto() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    getInputForItem(itemName) {
        return this.page.locator('td').filter({ hasText: itemName }).locator('..').locator('input[type="number"]');
    }

    async switchToTab(tabName) {
        const tabMap = {
            charm: this.charmTab,
            intimacy: this.intimacyTab
        };

        await tabMap[tabName].click();
        await this.page.waitForTimeout(300);
    }

    async setConcubines(count) {
        await this.concubinesInput.fill(count.toString());
    }

    async setCharmItem(item, value) {
        await this.charmInputs[item].fill(value.toString());
    }

    async setIntimacyItem(item, value) {
        await this.intimacyInputs[item].fill(value.toString());
    }

    async getCharmTotal() {
        const text = await this.charmTotal.textContent();
        return parseInt(text.replace('~', '').trim()) || 0;
    }

    async getIntimacyTotal() {
        const text = await this.intimacyTotal.textContent();
        return parseInt(text.replace('~', '').trim()) || 0;
    }

    async openSettings() {
        await this.settingsButton.click();
        await this.page.waitForTimeout(500);
    }

    async closeSettings() {
        await this.page.click('#settings-modal'); // клик по overlay
        await this.page.waitForTimeout(300);
    }

    async saveSettings() {
        await this.page.locator('button').filter({ hasText: 'Сохранить' }).click();
        await this.page.waitForTimeout(500);
    }

    async resetSettings() {
        await this.resetButton.click();
    }

    async resetSettingsWithConfirmation() {
        // Ждем диалог подтверждения
        this.page.once('dialog', dialog => dialog.accept());
        await this.resetButton.click();
    }
}