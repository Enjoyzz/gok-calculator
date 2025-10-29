import { BaseRepository } from './BaseRepository.js'

export class SharedRepository extends BaseRepository {
    constructor(sharedData) {
        super()
        this.sharedData = sharedData
    }

    get name() {
        return 'SharedRepository'
    }

    async loadCalculatorData() {
        return this.sharedData.calculatorData || {}
    }

    async loadFormulas() {
        return this.sharedData.formulas || {}
    }

    async saveCalculatorData() {
        console.warn('📖 Read-only mode: Cannot save in shared view')
        return false
    }

    async saveFormulas() {
        console.warn('📖 Read-only mode: Cannot save formulas in shared view')
        return false
    }

    canSave() {
        return false
    }
}