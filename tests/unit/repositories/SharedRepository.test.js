import { describe, it, expect, vi } from 'vitest'
import { SharedRepository } from '@/repositories/SharedRepository.js'
import { defaultFormulas } from '@/data/defaults.js'

describe('SharedRepository.js', () => {
    describe('Initialization', () => {
        it('should create repository with shared data', () => {
            const sharedData = {
                calculatorData: { test: 'data' },
                formulaSettings: { charm: { blueHadak: 2.0 } },
                activeTab: 'intimacy'
            }

            const repository = new SharedRepository(sharedData)

            expect(repository.sharedData).toEqual(sharedData)
        })

        it('should have correct name', () => {
            const repository = new SharedRepository({})
            expect(repository.name).toBe('SharedRepository')
        })
    })

    describe('Load calculator data', () => {
        it('should return shared calculator data', async () => {
            const sharedData = {
                calculatorData: { concubines: 5, blueHadak: 10 },
                formulaSettings: {}
            }
            const repository = new SharedRepository(sharedData)

            const result = await repository.loadCalculatorData()

            expect(result).toEqual({ concubines: 5, blueHadak: 10 })
        })

        it('should return empty object when no calculator data', async () => {
            const repository = new SharedRepository({})

            const result = await repository.loadCalculatorData()

            expect(result).toEqual({})
        })
    })

    describe('Load formulas', () => {
        it('should return shared formulas', async () => {
            const sharedData = {
                calculatorData: {},
                formulaSettings: { charm: { blueHadak: 2.0 } }
            }
            const repository = new SharedRepository(sharedData)

            const result = await repository.loadFormulas()

            expect(result).toEqual({ charm: { blueHadak: 2.0 } })
        })

        it('should return default formulas when no shared formulas', async () => {
            const repository = new SharedRepository({})

            const result = await repository.loadFormulas()

            expect(result).toEqual(defaultFormulas)
        })
    })

    describe('Save operations', () => {
        it('should not allow saving calculator data', async () => {
            const repository = new SharedRepository({})

            const result = await repository.saveCalculatorData({ test: 'data' })

            expect(result).toBe(false)
        })

        it('should not allow saving formulas', async () => {
            const repository = new SharedRepository({})

            const result = await repository.saveFormulas({ charm: {} })

            expect(result).toBe(false)
        })

        it('should return false for canSave', () => {
            const repository = new SharedRepository({})

            expect(repository.canSave()).toBe(false)
        })
    })

    describe('Tab method', () => {
        it('should return shared active tab', () => {
            const sharedData = {
                calculatorData: {},
                formulaSettings: {},
                activeTab: 'intimacy'
            }
            const repository = new SharedRepository(sharedData)

            expect(repository.tab()).toBe('intimacy')
        })

        it('should return charm as default tab', () => {
            const repository = new SharedRepository({})

            expect(repository.tab()).toBe('charm')
        })
    })
})