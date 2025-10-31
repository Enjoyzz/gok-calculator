import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCalculator } from '@/composables/calculator.js'
import { dataService } from '@/services/DataService.js'

// Мокаем DataService
vi.mock('@/services/DataService.js')

describe('calculator.js', () => {

    beforeEach(() => {
        vi.clearAllMocks()

        // Мокаем dataService напрямую
        dataService.loadAllData = vi.fn()
        dataService.saveCalculatorData = vi.fn()
        dataService.saveFormulas = vi.fn()
        dataService.resetFormulas = vi.fn()
        dataService.isSharedView = false
        dataService.savedActiveTab = vi.fn(() => 'charm')
        dataService.clearSharedMode = vi.fn()
        dataService.setHasInvalidShareData = vi.fn()
        dataService.getHasInvalidShareData = vi.fn()
    })

    describe('Initialization', () => {
        it('should initialize with default values', () => {
            const calculator = useCalculator()

            expect(calculator.isLoading.value).toBe(true)
            expect(calculator.error.value).toBe(null)
        })
    })

    describe('Data loading', () => {
        it('should load data successfully', async () => {
            const testData = {
                calculatorData: { test: 'data' },
                formulaSettings: { charm: {} }
            }
            dataService.loadAllData.mockResolvedValue(testData)

            const calculator = useCalculator()
            await calculator.loadData()

            expect(calculator.calculatorData.value).toEqual(testData.calculatorData)
            expect(calculator.formulaSettings.value).toEqual(testData.formulaSettings)
            expect(calculator.isLoading.value).toBe(false)
        })

        it('should handle load errors', async () => {
            dataService.loadAllData.mockRejectedValue(new Error('Load failed'))

            const calculator = useCalculator()
            await calculator.loadData()

            expect(calculator.error.value).toBe('Не удалось загрузить данные')
            expect(calculator.isLoading.value).toBe(false)
        })
    })

    describe('Data saving', () => {
        it('should save calculator data', async () => {
            dataService.saveCalculatorData.mockResolvedValue(true)
            const calculator = useCalculator()

            const result = await calculator.saveCalculatorData({ new: 'data' })

            expect(result).toBe(true)
            expect(dataService.saveCalculatorData).toHaveBeenCalledWith({ new: 'data' })
        })

        it('should save formulas', async () => {
            dataService.saveFormulas.mockResolvedValue(true)
            const calculator = useCalculator()

            const result = await calculator.saveFormulas({ charm: { test: 1 } })

            expect(result).toBe(true)
            expect(dataService.saveFormulas).toHaveBeenCalledWith({ charm: { test: 1 } })
        })
    })

    describe('Reset functionality', () => {
        it('should reset formulas', async () => {
            dataService.resetFormulas.mockResolvedValue(true)
            const calculator = useCalculator()

            const result = await calculator.resetFormulas()

            expect(result).toBe(true)
            expect(dataService.resetFormulas).toHaveBeenCalled()
        })
    })
})