export class BaseRepository {
    async loadCalculatorData() {
        throw new Error('Method not implemented')
    }

    async loadFormulas() {
        throw new Error('Method not implemented')
    }

    async saveCalculatorData(data) {
        throw new Error('Method not implemented')
    }

    async saveFormulas(formulas) {
        throw new Error('Method not implemented')
    }

    canSave() {
        return true
    }

    get name() {
        return 'BaseRepository'
    }
}