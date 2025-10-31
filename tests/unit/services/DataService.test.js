import {beforeEach, describe, expect, it, vi} from 'vitest'

vi.mock('@/repositories/RepositoryFactory.js', () => ({
    RepositoryFactory: {
        createRepository: vi.fn(() => ({
            canSave: vi.fn(() => true),
            loadCalculatorData: vi.fn(() => Promise.resolve({})),
            loadFormulas: vi.fn(() => Promise.resolve({})),
            saveCalculatorData: vi.fn(() => Promise.resolve(true)),
            saveFormulas: vi.fn(() => Promise.resolve(true)),
            resetFormulas: vi.fn(() => Promise.resolve()),
            name: 'TestRepository',
            tab: vi.fn()
        })),
        clearSharedMode: vi.fn()
    }
}))

import {DataService, dataService} from '@/services/DataService.js'
import {RepositoryFactory} from '@/repositories/RepositoryFactory.js'
import {SharedRepository} from "@/repositories/SharedRepository.js";






describe('DataService.js', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('DataService instance', () => {
        it('should be instance of DataService', () => {
            expect(dataService).toBeInstanceOf(DataService)
        })

        it('should have repository initialized', () => {
            expect(dataService.repository).toBeDefined()
        })
    })

    describe('Load operations', () => {
        it('should load all data successfully', async () => {
            const service = new DataService()
            const testData = {
                calculatorData: {concubines: 5},
                formulaSettings: {charm: {}}
            }

            service.repository.loadCalculatorData.mockResolvedValue(testData.calculatorData)
            service.repository.loadFormulas.mockResolvedValue(testData.formulaSettings)

            const result = await service.loadAllData()
            expect(result).toEqual(testData)
        })

        it('should handle load errors', async () => {
            const service = new DataService()
            service.repository.loadCalculatorData.mockRejectedValue(new Error('Load failed'))

            await expect(service.loadAllData()).rejects.toThrow('Load failed')
        })
    })

    describe('Save operations', () => {
        it('should save calculator data in normal mode', async () => {
            const service = new DataService()
            service.repository.canSave.mockReturnValue(true)
            service.repository.saveCalculatorData.mockResolvedValue(true)

            const result = await service.saveCalculatorData({test: 'data'})
            expect(result).toBe(true)
            expect(service.repository.saveCalculatorData).toHaveBeenCalledWith({test: 'data'})
        })

        it('should not save calculator data in shared view', async () => {
            const service = new DataService()
            service.repository.canSave.mockReturnValue(false)

            const result = await service.saveCalculatorData({test: 'data'})
            expect(result).toBe(false)
            expect(service.repository.saveCalculatorData).not.toHaveBeenCalled()
        })

        it('should save formulas in normal mode', async () => {
            const service = new DataService()
            service.repository.canSave.mockReturnValue(true)
            service.repository.saveFormulas.mockResolvedValue(true)

            const result = await service.saveFormulas({charm: {}})
            expect(result).toBe(true)
        })
    })

    describe('Reset operations', () => {
        it('should reset formulas in normal mode', async () => {
            const service = new DataService()
            service.repository.canSave.mockReturnValue(true)
            service.repository.resetFormulas.mockResolvedValue()

            const result = await service.resetFormulas()
            expect(result).toBe(true)
        })

        it('should not reset formulas in shared view', async () => {
            const service = new DataService()
            service.repository.canSave.mockReturnValue(false)

            const result = await service.resetFormulas()
            expect(result).toBe(false)
        })
    })

    describe('Shared mode operations', () => {
        it('should clear shared mode', () => {
            const service = new DataService()
            service.clearSharedMode()
            expect(RepositoryFactory.clearSharedMode).toHaveBeenCalled()
        })

        it('should return saved active tab', () => {
            const service = new DataService()

            // Создаем реальный инстанс SharedRepository с мок методом tab
            const sharedRepo = new SharedRepository({})
            sharedRepo.tab = vi.fn(() => 'intimacy')
            service.repository = sharedRepo

            const result = service.savedActiveTab()
            expect(result).toBe('intimacy')
        })
    })

    describe('Invalid share data', () => {
        it('should set and get invalid share data flag', () => {
            const service = new DataService()

            service.setHasInvalidShareData(true)
            expect(service.getHasInvalidShareData()).toBe(true)

            service.setHasInvalidShareData(false)
            expect(service.getHasInvalidShareData()).toBe(false)
        })
    })
})