import { DataService } from './DataService'
import { RepositoryFactory } from '@/repositories/RepositoryFactory'
import { LocalStorageRepository } from '@/repositories/LocalStorageRepository'
import { SharedRepository } from '@/repositories/SharedRepository'

describe('DataService', () => {
    let dataService
    let mockRepository

    beforeEach(() => {
        dataService = new DataService()
        mockRepository = {
            loadCalculatorData: vi.fn(),
            loadFormulas: vi.fn(),
            saveCalculatorData: vi.fn(),
            saveFormulas: vi.fn(),
            resetFormulas: vi.fn(),
            canSave: vi.fn(() => true),
            name: 'MockRepository'
        }
        dataService.repository = mockRepository
    })

    describe('loadAllData', () => {
        it('should load all data successfully', async () => {
            const mockData = { charm: 100 }
            const mockFormulas = { multiplier: 2 }

            mockRepository.loadCalculatorData.mockResolvedValue(mockData)
            mockRepository.loadFormulas.mockResolvedValue(mockFormulas)

            const result = await dataService.loadAllData()

            expect(result).toEqual({
                calculatorData: mockData,
                formulaSettings: mockFormulas
            })
        })

        it('should handle load errors', async () => {
            mockRepository.loadCalculatorData.mockRejectedValue(new Error('Load failed'))

            await expect(dataService.loadAllData()).rejects.toThrow('Load failed')
        })
    })

    describe('saveCalculatorData', () => {
        it('should save data when repository allows saving', async () => {
            const testData = { charm: 150 }
            mockRepository.saveCalculatorData.mockResolvedValue(true)

            const result = await dataService.saveCalculatorData(testData)

            expect(result).toBe(true)
            expect(mockRepository.saveCalculatorData).toHaveBeenCalledWith(testData)
        })

        it('should not save in shared view mode', async () => {
            mockRepository.canSave.mockReturnValue(false)

            const result = await dataService.saveCalculatorData({ charm: 150 })

            expect(result).toBe(false)
            expect(mockRepository.saveCalculatorData).not.toHaveBeenCalled()
        })
    })

    describe('shared mode', () => {
        it('should detect shared view mode', () => {
            dataService.repository.canSave = vi.fn(() => false)

            expect(dataService.isSharedView).toBe(true)
        })

        it('should clear shared mode', () => {
            const clearSpy = vi.spyOn(RepositoryFactory, 'clearSharedMode')

            dataService.clearSharedMode()

            expect(clearSpy).toHaveBeenCalled()
        })
    })
})