import { useCalculator } from './calculator'
import { dataService } from '@/services/DataService'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'

// Mock dependencies
vi.mock('@/services/DataService')
vi.mock('@/repositories/RepositoryFactory')

describe('useCalculator', () => {
    let calculator

    beforeEach(() => {
        vi.clearAllMocks()
        calculator = useCalculator()
    })

    describe('initialization', () => {
        it('should initialize with default values', () => {
            expect(calculator.isLoading.value).toBe(true)
            expect(calculator.error.value).toBeNull()
            expect(calculator.formulaSettings.value).toEqual({})
            expect(calculator.calculatorData.value).toEqual({})
        })
    })

    describe('data loading', () => {
        it('should load data successfully', async () => {
            const mockData = { charm: 100 }
            const mockFormulas = { multiplier: 2 }

            dataService.loadAllData.mockResolvedValue({
                calculatorData: mockData,
                formulaSettings: mockFormulas
            })

            await calculator.loadData()

            expect(calculator.isLoading.value).toBe(false)
            expect(calculator.error.value).toBeNull()
            expect(calculator.calculatorData.value).toEqual(mockData)
            expect(calculator.formulaSettings.value).toEqual(mockFormulas)
        })

        it('should handle load errors', async () => {
            dataService.loadAllData.mockRejectedValue(new Error('Load failed'))

            await calculator.loadData()

            expect(calculator.isLoading.value).toBe(false)
            expect(calculator.error.value).toBe('Не удалось загрузить данные')
        })
    })

    describe('data saving', () => {
        it('should save calculator data', async () => {
            const testData = { charm: 150 }
            dataService.saveCalculatorData.mockResolvedValue(true)

            const result = await calculator.saveCalculatorData(testData)

            expect(result).toBe(true)
            expect(dataService.saveCalculatorData).toHaveBeenCalledWith(testData)
        })

        it('should save formulas', async () => {
            const testFormulas = { charm: { multiplier: 3 } }
            dataService.saveFormulas.mockResolvedValue(true)

            const result = await calculator.saveFormulas(testFormulas)

            expect(result).toBe(true)
            expect(calculator.formulaSettings.value).toEqual(testFormulas)
        })
    })

    describe('shared mode events', () => {
        it('should handle invalid share data event', () => {
            const event = new CustomEvent('invalidShareData')

            window.dispatchEvent(event)

            expect(calculator.showInvalidShareModal.value).toBe(true)
        })

        it('should clear shared mode on confirm', () => {
            const clearSpy = vi.spyOn(RepositoryFactory, 'clearSharedMode')

            calculator.handleInvalidShareConfirm()

            expect(clearSpy).toHaveBeenCalled()
        })
    })
})