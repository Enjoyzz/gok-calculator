import { mount } from '@vue/test-utils'
import SaveIndicator from '@/components/SaveIndicator.vue'
import { describe, it, expect } from 'vitest'

describe('SaveIndicator.vue', () => {
    describe('conditional rendering', () => {
        it('should render when visible is true', () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: true,
                    message: 'Настройки сохранены'
                }
            })

            const indicator = wrapper.find('#saveIndicator')
            expect(indicator.exists()).toBe(true)
            expect(indicator.text()).toBe('Настройки сохранены')
        })

        it('should not render when visible is false', () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: false,
                    message: 'Настройки сохранены'
                }
            })

            const indicator = wrapper.find('#saveIndicator')
            expect(indicator.exists()).toBe(false)
        })

        it('should render with empty message', () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: true,
                    message: ''
                }
            })

            const indicator = wrapper.find('#saveIndicator')
            expect(indicator.exists()).toBe(true)
            expect(indicator.text()).toBe('')
        })
    })

    describe('props', () => {
        it('should display different messages', () => {
            const messages = [
                'Сохранено',
                'Настройки обновлены',
                'Данные загружены'
            ]

            messages.forEach(message => {
                const wrapper = mount(SaveIndicator, {
                    props: {
                        visible: true,
                        message
                    }
                })

                const indicator = wrapper.find('#saveIndicator')
                expect(indicator.text()).toBe(message)
            })
        })

        it('should handle long messages', () => {
            const longMessage = 'Очень длинное сообщение о сохранении настроек калькулятора'
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: true,
                    message: longMessage
                }
            })

            const indicator = wrapper.find('#saveIndicator')
            expect(indicator.text()).toBe(longMessage)
        })
    })

    describe('styling', () => {
        it('should have correct ID', () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: true,
                    message: 'Test'
                }
            })

            const indicator = wrapper.find('#saveIndicator')
            expect(indicator.attributes('id')).toBe('saveIndicator')
        })

        it('should have correct CSS classes and structure', () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: true,
                    message: 'Test'
                }
            })

            const indicator = wrapper.find('#saveIndicator')
            expect(indicator.element.tagName).toBe('DIV')
        })
    })

    describe('reactivity', () => {
        it('should update message when prop changes', async () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: true,
                    message: 'Старое сообщение'
                }
            })

            expect(wrapper.text()).toBe('Старое сообщение')

            await wrapper.setProps({ message: 'Новое сообщение' })

            expect(wrapper.text()).toBe('Новое сообщение')
        })

        it('should show/hide when visible prop changes', async () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: false,
                    message: 'Test'
                }
            })

            expect(wrapper.find('#saveIndicator').exists()).toBe(false)

            await wrapper.setProps({ visible: true })

            expect(wrapper.find('#saveIndicator').exists()).toBe(true)
            expect(wrapper.text()).toBe('Test')

            await wrapper.setProps({ visible: false })

            expect(wrapper.find('#saveIndicator').exists()).toBe(false)
        })
    })

    describe('accessibility', () => {
        it('should render as simple div element', () => {
            const wrapper = mount(SaveIndicator, {
                props: {
                    visible: true,
                    message: 'Test'
                }
            })

            const indicator = wrapper.find('#saveIndicator')
            expect(indicator.element.tagName).toBe('DIV')
        })
    })
})