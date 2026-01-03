import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import App from '@/App.vue'
import { useCalculator } from '@/composables/calculator.js'
import { useSaveIndicator } from '@/composables/saveIndicator.js'

// Моки композаблов
vi.mock('@/composables/calculator.js')
vi.mock('@/composables/saveIndicator.js')

describe('App.vue', () => {
    let mockUseCalculator
    let mockUseSaveIndicator

    beforeEach(() => {
        // Сбрасываем все моки перед каждым тестом
        vi.clearAllMocks()

        // Настройка моков с использованием ref для реактивности
        mockUseCalculator = {
            formulaSettings: ref({ charm: {}, intimacy: {} }),
            calculatorData: ref({ concubines: 1 }),
            isLoading: ref(false),
            error: ref(null),
            isSharedView: ref(false),
            saveCalculatorData: vi.fn().mockResolvedValue(true),
            saveFormulas: vi.fn().mockResolvedValue(true),
            resetFormulas: vi.fn().mockResolvedValue(true),
            clearSharedMode: vi.fn(),
            savedActiveTab: 'charm',
            showInvalidShareModal: ref(false),
            handleInvalidShareConfirm: vi.fn()
        }

        mockUseSaveIndicator = {
            showSaveIndicator: ref(false),
            saveMessage: ref(''),
            triggerSaveIndicator: vi.fn()
        }

        useCalculator.mockReturnValue(mockUseCalculator)
        useSaveIndicator.mockReturnValue(mockUseSaveIndicator)
    })

    describe('Initialization', () => {
        it('should initialize with default data', () => {
            const wrapper = mount(App)

            expect(useCalculator).toHaveBeenCalled()
            expect(useSaveIndicator).toHaveBeenCalled()
            expect(wrapper.exists()).toBe(true)
        })
    })

    describe('Loading states', () => {
        it('should show loading state when isLoading is true', async () => {
            mockUseCalculator.isLoading.value = true
            const wrapper = mount(App)

            // Ждем обновления DOM
            await wrapper.vm.$nextTick()

            expect(wrapper.find('.loading').exists()).toBe(true)
            expect(wrapper.find('.loading').text()).toBe('Загрузка...')
            expect(wrapper.find('.error').exists()).toBe(false)
        })

        it('should show error state when error exists', async () => {
            mockUseCalculator.error.value = 'Test error message'
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            expect(wrapper.find('.error').exists()).toBe(true)
            expect(wrapper.find('.error').text()).toBe('Test error message')
            expect(wrapper.find('.loading').exists()).toBe(false)
        })

        it('should show main content when not loading and no error', async () => {
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            expect(wrapper.find('.loading').exists()).toBe(false)
            expect(wrapper.find('.error').exists()).toBe(false)
            expect(wrapper.find('.gok_logo').exists()).toBe(true)
        })
    })

    describe('Invalid share modal', () => {
        it('should show invalid share modal when showInvalidShareModal is true', async () => {
            mockUseCalculator.showInvalidShareModal.value = true
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            expect(wrapper.find('.modal-overlay').exists()).toBe(true)
            expect(wrapper.find('.modal-content h3').text()).toBe('Некорректная ссылка')
            expect(wrapper.find('button.confirm-btn').exists()).toBe(true)
        })

        it('should not show main content when invalid share modal is shown', async () => {
            mockUseCalculator.showInvalidShareModal.value = true
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            expect(wrapper.find('.container').exists()).toBe(false)
            expect(wrapper.find('.modal-overlay').exists()).toBe(true)
        })

        it('should handle invalid share confirm click', async () => {
            mockUseCalculator.showInvalidShareModal.value = true
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()
            await wrapper.find('button.confirm-btn').trigger('click')

            expect(mockUseCalculator.handleInvalidShareConfirm).toHaveBeenCalled()
        })
    })

    describe('Main content rendering', () => {
        it('should render main content when not loading and no error', async () => {
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            expect(wrapper.find('.gok_logo').exists()).toBe(true)
            expect(wrapper.find('h1').text()).toBe('Калькулятор ресурсов')
            expect(wrapper.find('input[type="number"]').exists()).toBe(true)
        })

        it('should show readonly banner in shared view', async () => {
            mockUseCalculator.isSharedView.value = true
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            expect(wrapper.find('.readonly-banner').exists()).toBe(true)
            expect(wrapper.find('.readonly-banner').text()).toContain('Просмотр чужих данных')
        })

        it('should not show readonly banner in normal view', async () => {
            mockUseCalculator.isSharedView.value = false
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            expect(wrapper.find('.readonly-banner').exists()).toBe(false)
        })
    })

    describe('Concubines input', () => {
        it('should bind concubines input to calculatorData', async () => {
            mockUseCalculator.calculatorData.value.concubines = 5
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            const input = wrapper.find('input[type="number"]')
            expect(Number(input.element.value)).toBe(5)
        })

        it('should disable concubines input in shared view', async () => {
            mockUseCalculator.isSharedView.value = true
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            const input = wrapper.find('input[type="number"]')
            expect(input.attributes('disabled')).toBeDefined()
        })

        it('should enable concubines input in normal view', async () => {
            mockUseCalculator.isSharedView.value = false
            const wrapper = mount(App)

            await wrapper.vm.$nextTick()

            const input = wrapper.find('input[type="number"]')
            expect(input.attributes('disabled')).toBeUndefined()
        })
    })

    describe('Event handling', () => {
        it('should handle update calculator items', async () => {
            const wrapper = mount(App)
            const newItems = { test: 'data' }

            await wrapper.vm.handleUpdateCalculatorItems(newItems)

            expect(mockUseCalculator.saveCalculatorData).toHaveBeenCalledWith(newItems)
            expect(mockUseSaveIndicator.triggerSaveIndicator).toHaveBeenCalled()
        })

        it('should handle save formulas', async () => {
            const wrapper = mount(App)
            const newFormulas = { charm: { test: 1 } }

            await wrapper.vm.handleSaveFormulas(newFormulas)

            expect(mockUseCalculator.saveFormulas).toHaveBeenCalledWith(newFormulas)
            expect(mockUseSaveIndicator.triggerSaveIndicator).toHaveBeenCalledWith('✓ Настройки сохранены')
        })

        it('should handle reset settings', async () => {
            const wrapper = mount(App)

            await wrapper.vm.handleResetSettings()

            expect(mockUseCalculator.resetFormulas).toHaveBeenCalled()
            expect(mockUseSaveIndicator.triggerSaveIndicator).toHaveBeenCalledWith('✓ Настройки сброшены')
        })
    })

    describe('Save indicator integration', () => {
        it('should show save indicator when triggered', async () => {
            mockUseSaveIndicator.showSaveIndicator.value = true
            mockUseSaveIndicator.saveMessage.value = '✓ Данные сохранены'

            const wrapper = mount(App)
            await wrapper.vm.$nextTick()

            const saveIndicator = wrapper.findComponent({ name: 'SaveIndicator' })
            expect(saveIndicator.exists()).toBe(true)
            expect(saveIndicator.props('visible')).toBe(true)
            expect(saveIndicator.props('message')).toBe('✓ Данные сохранены')
        })
    })
})