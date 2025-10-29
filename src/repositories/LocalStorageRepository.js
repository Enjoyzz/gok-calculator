import { BaseRepository } from './BaseRepository.js'
import { defaultFormulas, defaultConcubines, defaultCharmItems, defaultIntimacyItems } from '@/data/defaults.js'

const defaultCalculatorData = {
    'concubines':  defaultConcubines,
    ...defaultIntimacyItems,
    ...defaultCharmItems,
}

export class LocalStorageRepository extends BaseRepository {
    constructor() {
        super()
        this.keys = {
            CALCULATOR_DATA: 'calculatorData',
            FORMULAS: 'formulaSettings'
        }
    }

    async loadCalculatorData() {

        try {
            const saved = localStorage.getItem(this.keys.CALCULATOR_DATA)
            if (saved) {
                const data = JSON.parse(saved)
                return { ...defaultCalculatorData, ...data }
            }
        } catch (error) {
            console.warn('Error loading calculator data from localStorage:', error)
        }
        return defaultCalculatorData
    }

    async loadFormulas() {
        try {
            const saved = localStorage.getItem(this.keys.FORMULAS)
            if (saved) {
                const formulas = JSON.parse(saved)
                return { ...defaultFormulas, ...formulas }
            }
        } catch (error) {
            console.warn('Error loading formulas from localStorage:', error)
        }
        return defaultFormulas
    }

    async saveCalculatorData(data) {
        try {
            localStorage.setItem(this.keys.CALCULATOR_DATA, JSON.stringify(data))
            return true
        } catch (error) {
            console.error('Error saving calculator data:', error)
            return false
        }
    }

    async saveFormulas(formulas) {
        try {
            localStorage.setItem(this.keys.FORMULAS, JSON.stringify(formulas))
            return true
        } catch (error) {
            console.error('Error saving formulas:', error)
            return false
        }
    }

    resetFormulas() {
        localStorage.removeItem(this.keys.FORMULAS)
    }
}