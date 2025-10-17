export class CalculatorPage {
    constructor(page) {
        this.page = page;

        // Основные элементы
        this.charmPoints = page.locator('[data-testid="charm-points"]');
        this.intimacyPoints = page.locator('[data-testid="intimacy-points"]');
        this.calculateButton = page.locator('[data-testid="calculate-button"]');

        // Вкладки
        this.charmTab = page.locator('[data-testid="tab-charm"]');
        this.intimacyTab = page.locator('[data-testid="tab-intimacy"]');
        this.settingsTab = page.locator('[data-testid="tab-settings"]');

        // Сохранение/загрузка
        this.saveButton = page.locator('[data-testid="save-button"]');
        this.loadButton = page.locator('[data-testid="load-button"]');

        // Настройки формул
        this.formulaInput = page.locator('[data-testid="formula-input"]');
        this.saveFormulaButton = page.locator('[data-testid="save-formula"]');

        // Фураж
        this.forageInput = page.locator('[data-testid="forage-input"]');
        this.forageDisplay = page.locator('[data-testid="forage-display"]');
    }

    async goto() {
        await this.page.goto('/');
    }

    async switchToTab(tabName) {
        const tabMap = {
            charm: this.charmTab,
            intimacy: this.intimacyTab,
            settings: this.settingsTab
        };
        await tabMap[tabName].click();
    }

    async calculatePoints() {
        await this.calculateButton.click();
    }

    async setForage(value) {
        await this.forageInput.fill(value.toString());
    }

    async saveData() {
        await this.saveButton.click();
    }

    async loadData() {
        await this.loadButton.click();
    }

    async updateFormula(formula) {
        await this.formulaInput.fill(formula);
        await this.saveFormulaButton.click();
    }
}