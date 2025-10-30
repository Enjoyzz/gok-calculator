import { mount } from '@vue/test-utils'
import SettingsModal from './SettingsModal.vue'

describe('SettingsModal', () => {
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

    it('should open modal with current formulas', async () => {
        const wrapper = mount(SettingsModal, {
            props: {
                formulaSettings: mockFormulas
            }
        })

        await wrapper.find('.btn-settings').trigger('click')

        expect(wrapper.vm.showSettings).toBe(true)
        expect(wrapper.vm.tempFormulas).toEqual(mockFormulas)
    })

    it('should emit save event with updated formulas', async () => {
        const wrapper = mount(SettingsModal, {
            props: {
                formulaSettings: mockFormulas
            }
        })

        await wrapper.find('.btn-settings').trigger('click')

        // Modify a value
        wrapper.vm.tempFormulas.charm.blueHadak = 2.0

        await wrapper.find('.settings-btn-primary').trigger('click')

        expect(wrapper.emitted('save')).toBeTruthy()
        expect(wrapper.emitted('save')[0]).toEqual([
            { ...mockFormulas, charm: { ...mockFormulas.charm, blueHadak: 2.0 } }
        ])
    })

    it('should emit reset event on reset button click', async () => {
        const wrapper = mount(SettingsModal, {
            props: {
                formulaSettings: mockFormulas
            },
            global: {
                mocks: {
                    confirm: vi.fn(() => true)
                }
            }
        })

        await wrapper.find('.btn-reset').trigger('click')

        expect(wrapper.emitted('reset')).toBeTruthy()
    })

    it('should validate input fields', async () => {
        const wrapper = mount(SettingsModal, {
            props: {
                formulaSettings: mockFormulas
            }
        })

        await wrapper.find('.btn-settings').trigger('click')

        // Set invalid value
        wrapper.vm.tempFormulas.charm.blueHadak = 0.5 // below min

        const validateSpy = vi.spyOn(wrapper.vm, 'validate')

        await wrapper.find('.settings-btn-primary').trigger('click')

        expect(validateSpy).toHaveBeenCalled()
    })

    it('should close modal on cancel', async () => {
        const wrapper = mount(SettingsModal, {
            props: {
                formulaSettings: mockFormulas
            }
        })

        await wrapper.find('.btn-settings').trigger('click')
        expect(wrapper.vm.showSettings).toBe(true)

        await wrapper.find('.settings-btn-secondary').trigger('click')
        expect(wrapper.vm.showSettings).toBe(false)
    })
})