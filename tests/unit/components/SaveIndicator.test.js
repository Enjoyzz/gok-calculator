import { mount } from '@vue/test-utils'
import SaveIndicator from './SaveIndicator.vue'

describe('SaveIndicator', () => {
    it('should be visible when prop is true', () => {
        const wrapper = mount(SaveIndicator, {
            props: {
                visible: true,
                message: '✓ Данные сохранены'
            }
        })

        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.text()).toBe('✓ Данные сохранены')
    })

    it('should not be visible when prop is false', () => {
        const wrapper = mount(SaveIndicator, {
            props: {
                visible: false,
                message: '✓ Данные сохранены'
            }
        })

        expect(wrapper.isVisible()).toBe(false)
    })

    it('should render custom message', () => {
        const wrapper = mount(SaveIndicator, {
            props: {
                visible: true,
                message: '✓ Настройки сохранены'
            }
        })

        expect(wrapper.text()).toBe('✓ Настройки сохранены')
    })

    it('should have correct styles', () => {
        const wrapper = mount(SaveIndicator, {
            props: {
                visible: true,
                message: '✓ Данные сохранены'
            }
        })

        const indicator = wrapper.find('#saveIndicator')

        expect(indicator.attributes('style')).toContain('position: fixed')
        expect(indicator.attributes('style')).toContain('bottom: 20px')
    })
})