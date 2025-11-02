import { RepositoryFactory } from '@/repositories/RepositoryFactory.js'
import {SharedRepository} from "@/repositories/SharedRepository.js";

export class DataService {
    constructor() {
        this.repository = RepositoryFactory.createRepository()
        this.isSharedView = !this.repository.canSave()
        this.hasInvalidShareData = false
    }

    async loadAppState() {
        try {
            const appState = await this.repository.loadAppState()
            console.log(`✅ App state loaded from ${this.repository.name}`, { appState })
            return appState
        } catch (error) {
            console.error('❌ Error loading app state:', error)
            throw error
        }
    }

    async saveAppState(state) {
        if (!this.repository.canSave()) {
            console.warn('🚫 Save blocked: shared view mode')
            return false
        }

        try {
            const success = await this.repository.saveAppState(state)
            if (success) {
                console.log('✅ App state saved')
            }
            return success
        } catch (error) {
            console.error('❌ Error saving app state:', error)
            return false
        }
    }

    async loadAllData() {
        try {
            const [calculatorData, formulaSettings] = await Promise.all([
                this.repository.loadCalculatorData(),
                this.repository.loadFormulas()
            ])

            console.log(`✅ Data loaded from ${this.repository.name}`, { calculatorData, formulaSettings })
            return { calculatorData, formulaSettings }
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

    async saveFormulas(formulaSettings) {
        if (!this.repository.canSave()) {
            console.warn('🚫 Save blocked: shared view mode')
            return false
        }

        try {
            const success = await this.repository.saveFormulas(formulaSettings)
            if (success) {
                console.log('✅ Formulas saved')
            }
            return success
        } catch (error) {
            console.error('❌ Error saving formulas:', error)
            return false
        }
    }

    async resetSettings() {
        if (!this.repository.canSave()) {
            console.warn('🚫 Reset blocked: shared view mode')
            return false
        }

        try {
            await this.repository.resetSettings()
            console.log('✅ Settings reset to defaults')
            return true
        } catch (error) {
            console.error('❌ Error resetting the settings:', error)
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

    getHasInvalidShareData() {
        return this.hasInvalidShareData
    }

    setHasInvalidShareData(value) {
        this.hasInvalidShareData = value
    }


    clearSharedMode() {
        console.log('Click on clearSharedMode()')
        RepositoryFactory.clearSharedMode()
    }

    savedActiveTab() {
        console.log(this.repository)
        if (this.repository instanceof SharedRepository) {
            return this.repository.tab()
        }
        return 'charm'
    }
}

export const dataService = new DataService()