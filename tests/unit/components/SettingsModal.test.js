import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsModal from '@/components/SettingsModal.vue'

describe('SettingsModal.vue', () => {
    const defaultFormulas = {
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

    const createWrapper = (props = {}) => {
        return mount(SettingsModal, {
            props: {
                formulaSettings: defaultFormulas,
                ...props
            }
        })
    }

    describe('Initialization', () => {
        it('should not show modal by default', () => {
            const wrapper = createWrapper()
            expect(wrapper.find('#settings-modal').exists()).toBe(false)
        })

        it('should open modal when button clicked', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.btn-settings').trigger('click')
            expect(wrapper.find('#settings-modal').exists()).toBe(true)
        })
    })

    describe('Form rendering', () => {
        it('should render charm settings', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.btn-settings').trigger('click')

            expect(wrapper.text()).toContain('Синий хадак (множитель)')
            expect(wrapper.text()).toContain('Серебряная шпилька (множитель)')
        })

        it('should render intimacy settings', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.btn-settings').trigger('click')

            expect(wrapper.text()).toContain('Ордос (множитель)')
            expect(wrapper.text()).toContain('Сандаловый браслет (множитель)')
        })
    })

    describe('Form actions', () => {
        it('should emit save event with updated formulas', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.btn-settings').trigger('click')

            const newValue = 2.0
            await wrapper.find('input[type="number"]').setValue(newValue)
            await wrapper.find('.settings-btn-primary').trigger('click')

            expect(wrapper.emitted('save')).toBeTruthy()
            expect(wrapper.emitted('save')[0][0].charm.blueHadak).toBe(newValue)
        })

        it('should emit reset event when reset clicked', async () => {
            const wrapper = createWrapper()
            vi.spyOn(window, 'confirm').mockReturnValue(true)

            await wrapper.find('.btn-reset').trigger('click')

            expect(wrapper.emitted('reset')).toBeTruthy()
        })

        it('should close modal without saving on cancel', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.btn-settings').trigger('click')
            await wrapper.find('.settings-btn-secondary').trigger('click')

            expect(wrapper.find('#settings-modal').exists()).toBe(false)
            expect(wrapper.emitted('save')).toBeUndefined()
        })
    })

    describe('Input validation', () => {
        it('should validate required fields', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.btn-settings').trigger('click')

            const input = wrapper.find('input[type="number"]')
            await input.setValue('')

            // Проверяем что валидация срабатывает
            expect(input.element.validity.valid).toBe(false)
        })
    })
})