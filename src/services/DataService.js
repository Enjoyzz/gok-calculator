import { RepositoryFactory } from '@/repositories/RepositoryFactory.js'

export class DataService {
    constructor() {
        this.repository = RepositoryFactory.createRepository()
        this.isSharedView = !this.repository.canSave()
    }

    async loadAllData() {
        try {
            const [calculatorData, formulas] = await Promise.all([
                this.repository.loadCalculatorData(),
                this.repository.loadFormulas()
            ])

            console.log(`✅ Data loaded from ${this.repository.name}`)
            return { calculatorData, formulas }
        } catch (error) {
            console.error('❌ Error loading data:', error)
            throw error
        }
    }

    async saveCalculatorData(data) {
        if (!this.repository.canSave()) {
            console.warn('🚫 Save blocked: shared view mode')
            return false
        }

        try {
            const success = await this.repository.saveCalculatorData(data)
            if (success) {
                console.log('✅ Calculator data saved')
            }
            return success
        } catch (error) {
            console.error('❌ Error saving calculator data:', error)
            return false
        }
    }

    async saveFormulas(formulas) {
        if (!this.repository.canSave()) {
            console.warn('🚫 Save blocked: shared view mode')
            return false
        }

        try {
            const success = await this.repository.saveFormulas(formulas)
            if (success) {
                console.log('✅ Formulas saved')
            }
            return success
        } catch (error) {
            console.error('❌ Error saving formulas:', error)
            return false
        }
    }

    async resetFormulas() {
        if (!this.repository.canSave()) {
            console.warn('🚫 Reset blocked: shared view mode')
            return false
        }

        try {
            await this.repository.resetFormulas()
            console.log('✅ Formulas reset to defaults')
            return true
        } catch (error) {
            console.error('❌ Error resetting formulas:', error)
            return false
        }
    }

    clearSharedMode() {
        if (this.isSharedView) {
            RepositoryFactory.clearSharedMode()
        }
    }
}

export const dataService = new DataService()