import {BaseRepository} from './BaseRepository.js'
import {
    defaultCharmItems,
    defaultConcubines,
    defaultFormulas,
    defaultIntimacyItems,
    defaultMeat,
    defaultMeatItems,
    defaultSilver,
    defaultSilverItems,
    defaultSoldiers, defaultSoldiersItems
} from '@/data/defaults.js'

const defaultCalculatorData = {
    'concubines': defaultConcubines,
    'silver': defaultSilver,
    'meat': defaultMeat,
    'soldiers': defaultSoldiers,
    ...defaultIntimacyItems,
    ...defaultCharmItems,
    ...defaultSoldiersItems,
    ...defaultMeatItems,
    ...defaultSilverItems
}

export class LocalStorageRepository extends BaseRepository {
    constructor() {
        super()
        this.keys = {
            CALCULATOR_DATA: 'calculatorData',
            FORMULAS: 'formulaSettings'
        }
    }

    get name() {
        return 'LocalStorageRepository'
    }

    async loadCalculatorData() {
        try {
            const saved = localStorage.getItem(this.keys.CALCULATOR_DATA)
            return saved
                ? {...defaultCalculatorData, ...JSON.parse(saved)}
                : defaultCalculatorData
        } catch (error) {
            console.warn('Error loading calculator data:', error)
            return defaultCalculatorData
        }
    }

    async loadFormulas() {
        try {
            const saved = localStorage.getItem(this.keys.FORMULAS)
            return saved
                ? {...defaultFormulas, ...JSON.parse(saved)}
                : defaultFormulas
        } catch (error) {
            console.warn('Error loading formulas:', error)
            return defaultFormulas
        }
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

    async resetFormulas() {
        localStorage.removeItem(this.keys.FORMULAS)
    }
}