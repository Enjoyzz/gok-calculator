import { mount } from '@vue/test-utils'
import SettingsModal from '@/components/SettingsModal.vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Мокаем window.confirm
const mockConfirm = vi.fn()

describe('SettingsModal.vue', () => {
    const defaultProps = {
        formulas: {
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
    }

    let wrapper

    beforeEach(() => {
        global.confirm = mockConfirm
        mockConfirm.mockClear()

        wrapper = mount(SettingsModal, {
            props: defaultProps
        })
    })

    describe('initial state', () => {
        it('should render settings buttons initially', () => {
            const settingsBtn = wrapper.find('.btn-settings')
            const resetBtn = wrapper.find('.btn-reset')

            expect(settingsBtn.exists()).toBe(true)
            expect(settingsBtn.text()).toBe('Настройки формул')
            expect(resetBtn.exists()).toBe(true)
            expect(resetBtn.text()).toBe('Сбросить настройки')
        })

        it('should not show modal initially', () => {
            const modal = wrapper.find('#settings-modal')
            expect(modal.exists()).toBe(false)
        })
    })

    describe('modal opening', () => {
        it('should open modal when settings button is clicked', async () => {
            const settingsBtn = wrapper.find('.btn-settings')
            await settingsBtn.trigger('click')

            const modal = wrapper.find('#settings-modal')
            expect(modal.exists()).toBe(true)
        })

        it('should copy formulas to tempFormulas when opening', async () => {
            await wrapper.find('.btn-settings').trigger('click')

            expect(wrapper.vm.tempFormulas).toEqual(defaultProps.formulas)
            expect(wrapper.vm.tempFormulas).not.toBe(defaultProps.formulas) // deep copy
        })
    })

    describe('modal content', () => {
        beforeEach(async () => {
            await wrapper.find('.btn-settings').trigger('click')
        })

        it('should render modal with correct title', () => {
            const modal = wrapper.find('#settings-modal-content')
            expect(modal.find('h2').text()).toBe('Настройки формул')
        })

        it('should render charm settings section', () => {
            const sections = wrapper.findAll('#settings-modal-section')
            expect(sections).toHaveLength(2)

            expect(sections[0].find('h3').text()).toBe('Обаяние')

            const charmInputs = sections[0].findAll('.settings-input')
            expect(charmInputs).toHaveLength(4)
        })

        it('should render intimacy settings section', () => {
            const sections = wrapper.findAll('#settings-modal-section')
            expect(sections[1].find('h3').text()).toBe('Близость')

            const intimacyInputs = sections[1].findAll('.settings-input')
            expect(intimacyInputs).toHaveLength(3)
        })

        it('should bind inputs to tempFormulas', async () => {
            const inputs = wrapper.findAll('.settings-input')

            // Проверяем начальные значения
            expect(inputs[0].element.value).toBe('1.5') // blueHadak
            expect(inputs[1].element.value).toBe('3')   // silverHairpin

            // Изменяем значение
            await inputs[0].setValue(2.0)
            expect(wrapper.vm.tempFormulas.charm.blueHadak).toBe(2.0)
        })

        it('should render action buttons', () => {
            const buttons = wrapper.findAll('.settings-btn')
            expect(buttons).toHaveLength(2)
            expect(buttons[0].text()).toBe('Сохранить')
            expect(buttons[1].text()).toBe('Отмена')
        })
    })

    describe('modal closing', () => {
        beforeEach(async () => {
            await wrapper.find('.btn-settings').trigger('click')
        })

        it('should close modal when cancel button is clicked', async () => {
            const cancelBtn = wrapper.find('.settings-btn-secondary')
            await cancelBtn.trigger('click')

            const modal = wrapper.find('#settings-modal')
            expect(modal.exists()).toBe(false)
        })

        it('should close modal when backdrop is clicked', async () => {
            const modal = wrapper.find('#settings-modal')
            await modal.trigger('click')

            expect(wrapper.find('#settings-modal').exists()).toBe(false)
        })

        it('should not close modal when content is clicked', async () => {
            const modalContent = wrapper.find('#settings-modal-content')
            await modalContent.trigger('click')

            expect(wrapper.find('#settings-modal').exists()).toBe(true)
        })
    })

    describe('save functionality', () => {
        beforeEach(async () => {
            await wrapper.find('.btn-settings').trigger('click')
        })

        it('should emit save event with tempFormulas', async () => {
            // Меняем значение
            const inputs = wrapper.findAll('.settings-input')
            await inputs[0].setValue(2.0)

            const saveBtn = wrapper.find('.settings-btn-primary')
            await saveBtn.trigger('click')

            expect(wrapper.emitted('save')).toBeTruthy()
            expect(wrapper.emitted('save')[0]).toEqual([
                {
                    charm: {
                        ...defaultProps.formulas.charm,
                        blueHadak: 2.0
                    },
                    intimacy: defaultProps.formulas.intimacy
                }
            ])
        })

        it('should close modal after save', async () => {
            const saveBtn = wrapper.find('.settings-btn-primary')
            await saveBtn.trigger('click')

            expect(wrapper.find('#settings-modal').exists()).toBe(false)
        })
    })

    describe('reset functionality', () => {
        it('should call confirm when reset button is clicked', async () => {
            const resetBtn = wrapper.find('.btn-reset')
            await resetBtn.trigger('click')

            expect(mockConfirm).toHaveBeenCalledWith('Сбросить все настройки формул к значениям по умолчанию?')
        })

        it('should emit reset event when confirm is true', async () => {
            mockConfirm.mockReturnValue(true)

            const resetBtn = wrapper.find('.btn-reset')
            await resetBtn.trigger('click')

            expect(wrapper.emitted('reset')).toBeTruthy()
        })

        it('should not emit reset event when confirm is false', async () => {
            mockConfirm.mockReturnValue(false)

            const resetBtn = wrapper.find('.btn-reset')
            await resetBtn.trigger('click')

            expect(wrapper.emitted('reset')).toBeUndefined()
        })
    })

    describe('input validation', () => {
        beforeEach(async () => {
            await wrapper.find('.btn-settings').trigger('click')
        })

        it('should have correct input attributes for charm settings', () => {
            const inputs = wrapper.findAll('.settings-input')

            // blueHadak
            expect(inputs[0].attributes('min')).toBe('1')
            expect(inputs[0].attributes('max')).toBe('3')
            expect(inputs[0].attributes('step')).toBe('0.1')

            // silverHairpin
            expect(inputs[1].attributes('min')).toBe('1')
            expect(inputs[1].attributes('max')).toBe('5')
        })

        it('should have correct input attributes for intimacy settings', () => {
            const inputs = wrapper.findAll('.settings-input')

            // ordos (первый input в intimacy секции)
            expect(inputs[4].attributes('min')).toBe('1')
            expect(inputs[4].attributes('max')).toBe('3')
        })
    })

    describe('settings configuration', () => {
        it('should have correct charm settings configuration', () => {
            expect(wrapper.vm.charmSettings).toEqual([
                {key: 'blueHadak', label: 'Синий хадак (множитель)', step: 0.1, min: 1, max: 3},
                {key: 'silverHairpin', label: 'Серебряная шпилька (множитель)', step: 0.1, min: 1, max: 5},
                {key: 'chests', label: 'Сундуки (множитель)', step: 0.1, min: 0},
                {key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 0}
            ])
        })

        it('should have correct intimacy settings configuration', () => {
            expect(wrapper.vm.intimacySettings).toEqual([
                {key: 'ordos', label: 'Ордос (множитель)', step: 0.1, min: 1, max: 3},
                {key: 'sandalwoodBracelet', label: 'Сандаловый браслет (множитель)', step: 0.1, min: 1, max: 5},
                {key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 0}
            ])
        })
    })
})