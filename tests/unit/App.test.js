import { mount } from '@vue/test-utils'
import App from './App.vue'

// Mock composables
vi.mock('@/composables/calculator.js', () => ({
    useCalculator: () => ({
        formulaSettings: { value: {} },
        calculatorData: { value: { concubines: 1 } },
        isLoading: { value: false },
        error: { value: null },
        isSharedView: { value: false },
        saveCalculatorData: vi.fn(),
        saveFormulas: vi.fn(),
        resetFormulas: vi.fn(),
        clearSharedMode: vi.fn(),
        savedActiveTab: 'charm',
        showInvalidShareModal: { value: false },
        handleInvalidShareConfirm: vi.fn()
    })
}))

vi.mock('@/composables/saveIndicator.js', () => ({
    useSaveIndicator: () => ({
        showSaveIndicator: { value: false },
        saveMessage: { value: '' },
        triggerSaveIndicator: vi.fn()
    })
}))

describe('App', () => {
    it('should render main application', () => {
        const wrapper = mount(App)

        expect(wrapper.text()).toContain('Калькулятор обаяния и близости')
        expect(wrapper.text()).toContain('Кол-во наложниц:')
    })

    it('should show loading state', async () => {
        const mockUseCalculator = await import('@/composables/calculator.js')
        mockUseCalculator.useCalculator = () => ({
            ...mockUseCalculator.useCalculator(),
            isLoading: { value: true }
        })

        const wrapper = mount(App)

        expect(wrapper.find('.loading').exists()).toBe(true)
        expect(wrapper.text()).toContain('Загрузка...')
    })

    it('should show error state', async () => {
        const mockUseCalculator = await import('@/composables/calculator.js')
        mockUseCalculator.useCalculator = () => ({
            ...mockUseCalculator.useCalculator(),
            error: { value: 'Ошибка загрузки' }
        })

        const wrapper = mount(App)

        expect(wrapper.find('.error').exists()).toBe(true)
        expect(wrapper.text()).toContain('Ошибка загрузки')
    })

    it('should show shared view banner', async () => {
        const mockUseCalculator = await import('@/composables/calculator.js')
        mockUseCalculator.useCalculator = () => ({
            ...mockUseCalculator.useCalculator(),
            isSharedView: { value: true }
        })

        const wrapper = mount(App)

        expect(wrapper.find('.readonly-banner').exists()).toBe(true)
        expect(wrapper.text()).toContain('Просмотр чужих данных')
    })

    it('should update concubines value', async () => {
        const saveCalculatorData = vi.fn().mockResolvedValue(true)
        const triggerSaveIndicator = vi.fn()

        const mockUseCalculator = await import('@/composables/calculator.js')
        mockUseCalculator.useCalculator = () => ({
            ...mockUseCalculator.useCalculator(),
            saveCalculatorData,
            calculatorData: { value: { concubines: 1 } }
        })

        const mockUseSaveIndicator = await import('@/composables/saveIndicator.js')
        mockUseSaveIndicator.useSaveIndicator = () => ({
            showSaveIndicator: { value: false },
            saveMessage: { value: '' },
            triggerSaveIndicator
        })

        const wrapper = mount(App)

        const input = wrapper.find('input[type="number"]')
        await input.setValue(5)

        // Wait for watcher to trigger
        await wrapper.vm.$nextTick()

        expect(saveCalculatorData).toHaveBeenCalled()
    })
})