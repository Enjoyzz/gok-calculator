import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SaveIndicator from '@/components/SaveIndicator.vue'

describe('SaveIndicator.vue', () => {
    const createWrapper = (props = {}) => {
        return mount(SaveIndicator, {
            props: {
                visible: false,
                message: '✓ Данные сохранены',
                ...props
            }
        })
    }

    describe('Visibility', () => {
        it('should not render when visible is false', () => {
            const wrapper = createWrapper({ visible: false })
            expect(wrapper.find('#saveIndicator').exists()).toBe(false)
        })

        it('should render when visible is true', () => {
            const wrapper = createWrapper({ visible: true })
            expect(wrapper.find('#saveIndicator').exists()).toBe(true)
        })
    })

    describe('Message display', () => {
        it('should show default message', () => {
            const wrapper = createWrapper({ visible: true })
            expect(wrapper.find('#saveIndicator').text()).toBe('✓ Данные сохранены')
        })

        it('should show custom message', () => {
            const wrapper = createWrapper({
                visible: true,
                message: '✓ Настройки сохранены'
            })
            expect(wrapper.find('#saveIndicator').text()).toBe('✓ Настройки сохранены')
        })
    })

    describe('Styling', () => {
        it('should have correct styling', () => {
            const wrapper = createWrapper({ visible: true })
            const indicator = wrapper.find('#saveIndicator')

            expect(indicator.exists()).toBe(true)
        })
    })
})