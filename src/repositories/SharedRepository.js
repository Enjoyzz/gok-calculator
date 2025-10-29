import { BaseRepository } from './BaseRepository.js'

export class SharedRepository extends BaseRepository {
    constructor(sharedData) {
        super()
        this.sharedData = sharedData
    }

    async loadCalculatorData() {
        return this.sharedData.calculatorData || {}
    }

    async loadFormulas() {
        return this.sharedData.formulas || {}
    }

    // Shared репозиторий только для чтения
    async saveCalculatorData() {
        console.warn('Cannot save data in shared mode')
        return false
    }

    async saveFormulas() {
        console.warn('Cannot save formulas in shared mode')
        return false
    }

    canSave() {
        return false
    }
}