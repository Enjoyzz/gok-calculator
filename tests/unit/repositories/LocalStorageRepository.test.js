import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LocalStorageRepository } from '@/repositories/LocalStorageRepository.js'
import { defaultFormulas, defaultConcubines, defaultCharmItems, defaultIntimacyItems } from '@/data/defaults.js'

describe('LocalStorageRepository.js', () => {
    let repository
    let localStorageMock

    const defaultCalculatorData = {
        concubines: defaultConcubines,
        ...defaultIntimacyItems,
        ...defaultCharmItems
    }

    beforeEach(() => {
        repository = new LocalStorageRepository()

        localStorageMock = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn()
        }

        global.localStorage = localStorageMock
    })

    describe('Initialization', () => {
        it('should create repository with correct keys', () => {
            expect(repository.keys.CALCULATOR_DATA).toBe('calculatorData')
            expect(repository.keys.FORMULAS).toBe('formulaSettings')
        })

        it('should have correct name', () => {
            expect(repository.name).toBe('LocalStorageRepository')
        })
    })

    describe('Load calculator data', () => {
        it('should load saved calculator data', async () => {
            const savedData = { concubines: 5, blueHadak: 10 }
            localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData))

            const result = await repository.loadCalculatorData()

            expect(localStorageMock.getItem).toHaveBeenCalledWith('calculatorData')
            expect(result).toEqual({ ...defaultCalculatorData, ...savedData })
        })

        it('should return default data when no saved data', async () => {
            localStorageMock.getItem.mockReturnValue(null)

            const result = await repository.loadCalculatorData()

            expect(result).toEqual(defaultCalculatorData)
        })

        it('should handle parse errors and return default data', async () => {
            localStorageMock.getItem.mockReturnValue('invalid json')

            const result = await repository.loadCalculatorData()

            expect(result).toEqual(defaultCalculatorData)
        })
    })

    describe('Load formulas', () => {
        it('should load saved formulas', async () => {
            const savedFormulas = { charm: { blueHadak: 2.0 } }
            localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFormulas))

            const result = await repository.loadFormulas()

            expect(localStorageMock.getItem).toHaveBeenCalledWith('formulaSettings')
            expect(result).toEqual({ ...defaultFormulas, ...savedFormulas })
        })

        it('should return default formulas when no saved data', async () => {
            localStorageMock.getItem.mockReturnValue(null)

            const result = await repository.loadFormulas()

            expect(result).toEqual(defaultFormulas)
        })
    })

    describe('Save calculator data', () => {
        it('should save calculator data successfully', async () => {
            const testData = { concubines: 3, blueHadak: 5 }

            const result = await repository.saveCalculatorData(testData)

            expect(localStorageMock.setItem).toHaveBeenCalledWith('calculatorData', JSON.stringify(testData))
            expect(result).toBe(true)
        })

        it('should handle save errors', async () => {
            localStorageMock.setItem.mockImplementation(() => {
                throw new Error('Storage failed')
            })

            const result = await repository.saveCalculatorData({})

            expect(result).toBe(false)
        })
    })

    describe('Save formulas', () => {
        it('should save formulas successfully', async () => {
            const testFormulas = { charm: { blueHadak: 1.8 } }

            const result = await repository.saveFormulas(testFormulas)

            expect(localStorageMock.setItem).toHaveBeenCalledWith('formulaSettings', JSON.stringify(testFormulas))
            expect(result).toBe(true)
        })
    })

    describe('Reset formulas', () => {
        it('should remove formulas from storage', async () => {
            await repository.resetFormulas()

            expect(localStorageMock.removeItem).toHaveBeenCalledWith('formulaSettings')
        })
    })
})