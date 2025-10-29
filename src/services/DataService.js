import { RepositoryFactory } from '@/repositories/RepositoryFactory.js'

export class DataService {
    constructor() {
        this.repository = RepositoryFactory.createRepository()
        this.isSharedView = !this.repository.canSave()

        this.loadAllData().then(data => console.log(data))
    }

    async loadAllData() {
        const [calculatorData, formulas] = await Promise.all([
            this.repository.loadCalculatorData(),
            this.repository.loadFormulas()
        ])

        return { calculatorData, formulas }
    }

    async saveCalculatorData(data) {
        if (this.repository.canSave()) {
            return await this.repository.saveCalculatorData(data)
        }
        return false
    }

    async saveFormulas(formulas) {
        if (this.repository.canSave()) {
            return await this.repository.saveFormulas(formulas)
        }
        return false
    }

    resetFormulas() {
        if (this.repository.resetFormulas) {
            this.repository.resetFormulas()
        }
    }

    clearSharedMode() {
        if (this.isSharedView) {
            RepositoryFactory.clearSharedMode()
        }
    }
}

export const dataService = new DataService()