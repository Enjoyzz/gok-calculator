import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import { useStorage } from '@/composables/storage'
import { useFormulas } from '@/composables/formulas'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Мокаем композаблы
vi.mock('@/composables/storage')
vi.mock('@/composables/formulas')

// Правильные моки для компонентов с default export
vi.mock('@/components/CalculatorTabs.vue', () => ({
    default: {
        name: 'CalculatorTabs',
        template: '<div>CalculatorTabs</div>',
        props: ['concubines', 'charmItems', 'intimacyItems', 'formulas']
    }
}))

vi.mock('@/components/SettingsModal.vue', () => ({
    default: {
        name: 'SettingsModal',
        template: '<div>SettingsModal</div>',
        props: ['formulas']
    }
}))

vi.mock('@/components/SaveIndicator.vue', () => ({
    default: {
        name: 'SaveIndicator',
        template: '<div>SaveIndicator</div>',
        props: ['visible', 'message']
    }
}))

describe('App.vue', () => {
    const mockSaveToStorage = vi.fn()
    const mockSaveFormulas = vi.fn()
    const mockResetFormulas = vi.fn()

    const mockSavedData = {
        concubines: 5,
        blueHadak: 10,
        whiteHadak: 5,
        goldHairpin: 3,
        silverHairpin: 8,
        perfume: 15,
        chests: 4,
        forage: 20,
        ordos: 8,
        takya: 6,
        jadeBracelet: 4,
        sandalwoodBracelet: 7,
        goldEarrings: 5,
        gemRing: 10,
        loveLetter: 12
    }

    const mockFormulas = {
        charm: {
            blueHadak: 1.5,
            silverHairpin: 3,
            chests: 2.2,
            forage: 1.5
        },
        intimacy: {
            ordos: 1.5,
            sandalwoodBracelet: 3,
            forage: 1.2
        }
    }

    let wrapper

    beforeEach(() => {
        vi.useFakeTimers()

        useStorage.mockReturnValue({
            savedData: { value: mockSavedData },
            saveToStorage: mockSaveToStorage
        })

        useFormulas.mockReturnValue({
            formulas: { value: mockFormulas },
            saveFormulas: mockSaveFormulas,
            resetFormulas: mockResetFormulas
        })

        wrapper = mount(App)
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    describe('initialization', () => {
        it('should render main components', () => {
            expect(wrapper.find('h1').text()).toBe('Калькулятор обаяния и близости')
            expect(wrapper.text()).toContain('CalculatorTabs')
            expect(wrapper.text()).toContain('SettingsModal')
        })

        it('should load data from storage on init', () => {
            expect(wrapper.vm.concubines).toBe(5)
            expect(wrapper.vm.charmItems.blueHadak).toBe(10)
            expect(wrapper.vm.charmItems.whiteHadak).toBe(5)
            expect(wrapper.vm.intimacyItems.ordos).toBe(8)
            expect(wrapper.vm.intimacyItems.takya).toBe(6)
            expect(wrapper.vm.charmItems.forage).toBe(20)
            expect(wrapper.vm.intimacyItems.forage).toBe(20)
        })

        it('should initialize with default values when no saved data', () => {
            useStorage.mockReturnValue({
                savedData: { value: {} },
                saveToStorage: mockSaveToStorage
            })

            const freshWrapper = mount(App)

            expect(freshWrapper.vm.concubines).toBe(1)

            // Проверяем что все поля инициализированы нулями
            Object.keys(freshWrapper.vm.charmItems).forEach(key => {
                expect(freshWrapper.vm.charmItems[key]).toBe(0)
            })
            Object.keys(freshWrapper.vm.intimacyItems).forEach(key => {
                expect(freshWrapper.vm.intimacyItems[key]).toBe(0)
            })
        })
    })

    describe('concubines input', () => {
        it('should render concubines input with correct value', () => {
            const input = wrapper.find('input[type="number"]')
            expect(input.attributes('min')).toBe('1')
            expect(Number(input.element.value)).toBe(5)
        })

        it('should update concubines value when input changes', async () => {
            const input = wrapper.find('input[type="number"]')
            await input.setValue(10)

            expect(wrapper.vm.concubines).toBe(10)
        })
    })

    describe('data updates', () => {
        it('should update charm items', async () => {
            const newCharmItems = { blueHadak: 15, silverHairpin: 8 }
            await wrapper.vm.updateCharmItems(newCharmItems)

            expect(wrapper.vm.charmItems.blueHadak).toBe(15)
            expect(wrapper.vm.charmItems.silverHairpin).toBe(8)
            // Другие значения должны сохраниться
            expect(wrapper.vm.charmItems.whiteHadak).toBe(5)
        })

        it('should update intimacy items', async () => {
            const newIntimacyItems = { ordos: 12, sandalwoodBracelet: 6 }
            await wrapper.vm.updateIntimacyItems(newIntimacyItems)

            expect(wrapper.vm.intimacyItems.ordos).toBe(12)
            expect(wrapper.vm.intimacyItems.sandalwoodBracelet).toBe(6)
            expect(wrapper.vm.intimacyItems.takya).toBe(6)
        })
    })

    describe('formulas management', () => {
        it('should handle formulas save', async () => {
            const newFormulas = {
                charm: { ...mockFormulas.charm, blueHadak: 2.0 },
                intimacy: mockFormulas.intimacy
            }

            await wrapper.vm.handleSaveFormulas(newFormulas)

            expect(mockSaveFormulas).toHaveBeenCalledWith(newFormulas)
            expect(wrapper.vm.showSaveIndicator).toBe(true)
            expect(wrapper.vm.saveMessage).toBe('✓ Настройки сохранены')
        })

        it('should handle settings reset', async () => {
            await wrapper.vm.resetSettings()

            expect(mockResetFormulas).toHaveBeenCalled()
            expect(wrapper.vm.showSaveIndicator).toBe(true)
            expect(wrapper.vm.saveMessage).toBe('✓ Настройки сброшены')
        })
    })

    describe('save indicator', () => {
        it('should trigger save indicator with custom message', async () => {
            await wrapper.vm.triggerSaveIndicator('Custom message')

            expect(wrapper.vm.showSaveIndicator).toBe(true)
            expect(wrapper.vm.saveMessage).toBe('Custom message')

            vi.advanceTimersByTime(3000)

            expect(wrapper.vm.showSaveIndicator).toBe(false)
        })

        it('should trigger save indicator with default message', async () => {
            await wrapper.vm.triggerSaveIndicator()

            expect(wrapper.vm.saveMessage).toBe('✓ Данные сохранены')
        })
    })

    describe('forage synchronization', () => {
        it('should sync charm forage to intimacy forage', async () => {
            // Вместо setData используем прямое присваивание через .value
            wrapper.vm.charmItems.forage = 30
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.intimacyItems.forage).toBe(30)
        })

        it('should sync intimacy forage to charm forage', async () => {
            wrapper.vm.intimacyItems.forage = 25
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.charmItems.forage).toBe(25)
        })
    })

    describe('auto-save functionality', () => {
        it('should save to storage when concubines changes', async () => {
            wrapper.vm.concubines = 8
            await wrapper.vm.$nextTick()

            // Проверяем что saveToStorage был вызван с правильными данными
            expect(mockSaveToStorage).toHaveBeenCalledWith({
                concubines: 8,
                ...wrapper.vm.charmItems,
                ...wrapper.vm.intimacyItems
            })
        })

        it('should trigger save indicator on auto-save', async () => {
            wrapper.vm.concubines = 6
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.showSaveIndicator).toBe(true)
            expect(wrapper.vm.saveMessage).toBe('✓ Данные сохранены')
        })
    })
})