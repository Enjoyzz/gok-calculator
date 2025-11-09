import { describe, it, expect, vi } from 'vitest'
import { SharedRepository } from '@/repositories/SharedRepository.js'
import { defaultFormulas } from '@/data/defaults.js'

describe('SharedRepository.js', () => {
    describe('Initialization', () => {
        it('should create repository with shared data', () => {
            const sharedData = {
                calcValues: { test: 'data' },
                setting: { charm: { blueHadak: 2.0 } },
                activeTab: 'intimacy'
            }

            const repository = new SharedRepository(sharedData)

            expect(repository.sharedData).toEqual(sharedData)
        })

        it('should have correct name', () => {
            const repository = new SharedRepository({calcValues: {}, setting: {}, activeTab: ''})
            expect(repository.name).toBe('SharedRepository')
        })
    })

    describe('Load calculator data', () => {
        it('should return shared calculator data', async () => {
            const sharedData = {
                calcValues: { concubines: 5, blueHadak: 10 },
                setting: {},
                activeTab: ''
            }
            const repository = new SharedRepository(sharedData)

            const result = await repository.loadAppState()

            expect(result).toEqual(sharedData)
        })

        it('should return empty object when no calculator data', async () => {
            const repository = new SharedRepository({calcValues: {}, setting: {}, activeTab: ''})

            const result = await repository.loadAppState()

            expect(result).toEqual({calcValues: {}, setting: {}, activeTab: ''})
        })
    })

    describe('Load formulas', () => {
        it('should return shared formulas', async () => {
            const sharedData = {
                calcValues: {},
                setting: { charm: { blueHadak: 2.0 } },
                activeTab: ''
            }
            const repository = new SharedRepository(sharedData)

            const result = await repository.loadAppState()

            expect(result).toEqual(sharedData)
        })

        it('should return default formulas when no shared formulas', async () => {
            const repository = new SharedRepository({calcValues: {}, setting: {}, activeTab: ''})

            const result = await repository.loadAppState()

            expect(result).toEqual({calcValues: {}, setting: {}, activeTab: ''})
        })
    })

    describe('Save operations', () => {
        it('should not allow saving calculator data', async () => {
            const repository = new SharedRepository({calcValues: {}, setting: {}, activeTab: ''})

            const result = await repository.saveAppState({ test: 'data' })

            expect(result).toBe(false)
        })

        it('should not allow saving formulas', async () => {
            const repository = new SharedRepository({calcValues: {}, setting: {}, activeTab: ''})

            const result = await repository.saveAppState({ charm: {} })

            expect(result).toBe(false)
        })

        it('should return false for canSave', () => {
            const repository = new SharedRepository({calcValues: {}, setting: {}, activeTab: ''})

            expect(repository.canSave()).toBe(false)
        })
    })

    describe('Tab method', () => {
        it('should return shared active tab', () => {
            const sharedData = {
                calcValues: {},
                setting: {},
                activeTab: 'intimacy'
            }
            const repository = new SharedRepository(sharedData)

            expect(repository.tab()).toBe('intimacy')
        })

        it('should return charm as default tab', () => {
            const repository = new SharedRepository({calcValues: {}, setting: {}, activeTab: ''})

            expect(repository.tab()).toBe('charm')
        })
    })
})