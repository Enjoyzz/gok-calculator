import { LocalStorageRepository } from './LocalStorageRepository'
import { defaultFormulas, defaultCalculatorData } from '@/data/defaults'

describe('LocalStorageRepository', () => {
    let repository
    let mockLocalStorage

    beforeEach(() => {
        repository = new LocalStorageRepository()
        mockLocalStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn()
        }
        global.localStorage = mockLocalStorage
    })

    describe('loadCalculatorData', () => {
        it('should load saved data', async () => {
            const savedData = { charm: 200, concubines: 5 }
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData))

            const result = await repository.loadCalculatorData()

            expect(result).toEqual({ ...defaultCalculatorData, ...savedData })
        })

        it('should return defaults when no saved data', async () => {
            mockLocalStorage.getItem.mockReturnValue(null)

            const result = await repository.loadCalculatorData()

            expect(result).toEqual(defaultCalculatorData)
        })

        it('should handle parse errors and return defaults', async () => {
            mockLocalStorage.getItem.mockReturnValue('invalid json')

            const result = await repository.loadCalculatorData()

            expect(result).toEqual(defaultCalculatorData)
        })
    })

    describe('saveCalculatorData', () => {
        it('should save data successfully', async () => {
            mockLocalStorage.setItem.mockImplementation(() => {})

            const result = await repository.saveCalculatorData({ charm: 300 })

            expect(result).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalled()
        })

        it('should handle save errors', async () => {
            mockLocalStorage.setItem.mockImplementation(() => {
                throw new Error('Storage failed')
            })

            const result = await repository.saveCalculatorData({ charm: 300 })

            expect(result).toBe(false)
        })
    })
})