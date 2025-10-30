import { SharedRepository } from './SharedRepository'
import { defaultFormulas } from '@/data/defaults'

describe('SharedRepository', () => {
    let repository
    let sharedData

    beforeEach(() => {
        sharedData = {
            calculatorData: { charm: 100, intimacy: 200 },
            formulaSettings: { charm: { multiplier: 3 } },
            activeTab: 'charm'
        }
        repository = new SharedRepository(sharedData)
    })

    it('should load shared calculator data', async () => {
        const result = await repository.loadCalculatorData()

        expect(result).toEqual(sharedData.calculatorData)
    })

    it('should load shared formulas', async () => {
        const result = await repository.loadFormulas()

        expect(result).toEqual(sharedData.formulaSettings)
    })

    it('should return defaults when shared data is incomplete', async () => {
        repository = new SharedRepository({})

        const result = await repository.loadFormulas()

        expect(result).toEqual(defaultFormulas)
    })

    it('should not allow saving in shared mode', async () => {
        const saveResult = await repository.saveCalculatorData({ charm: 100 })
        const formulaResult = await repository.saveFormulas({})

        expect(saveResult).toBe(false)
        expect(formulaResult).toBe(false)
        expect(repository.canSave()).toBe(false)
    })

    it('should return active tab from shared data', () => {
        expect(repository.tab()).toBe('charm')
    })
})