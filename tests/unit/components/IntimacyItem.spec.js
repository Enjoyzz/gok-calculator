import { mount } from '@vue/test-utils'
import IntimacyItem from '@/components/IntimacyItem.vue'
import { describe, it, expect } from 'vitest'

describe('IntimacyItem.vue', () => {
    const defaultProps = {
        item: {
            id: 'ordos',
            name: 'Ордос',
            icon: '/icons/ordos.png',
            bgColor: '/bg/red.png',
            description: 'Дает очки близости'
        },
        value: 8,
        total: 60
    }

    describe('rendering', () => {
        it('should render item name and description', () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            expect(wrapper.text()).toContain('Ордос')
            expect(wrapper.text()).toContain('Дает очки близости')
        })

        it('should render icon with background', () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            const bgDiv = wrapper.find('.bg')
            const img = wrapper.find('img')

            expect(bgDiv.attributes('style')).toContain(`url("${defaultProps.item.bgColor}")`)
            expect(img.attributes('src')).toBe(defaultProps.item.icon)
            expect(img.attributes('alt')).toBe(defaultProps.item.name)
        })

        it('should render input with current value', () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            expect(input.element.value).toBe('8')
            expect(input.attributes('type')).toBe('number')
            expect(input.attributes('min')).toBe('0')
        })

        it('should render total value', () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            const cells = wrapper.findAll('td')
            expect(cells[3].text()).toBe('60')
        })
    })

    describe('events', () => {
        it('should emit update event when input changes', async () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('12')

            expect(wrapper.emitted('update')).toBeTruthy()
            expect(wrapper.emitted('update')[0]).toEqual(['ordos', 12])
        })

        it('should handle zero when input is invalid', async () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('invalid')

            expect(wrapper.emitted('update')[0]).toEqual(['ordos', 0])
        })

        it('should handle decimal values', async () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('10.7')

            expect(wrapper.emitted('update')[0]).toEqual(['ordos', 10])
        })
    })

    describe('with different props', () => {
        it('should handle negative values as zero', async () => {
            const wrapper = mount(IntimacyItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('-3')

            expect(wrapper.emitted('update')[0]).toEqual(['ordos', 0])
        })

        it('should render correctly with zero values', () => {
            const wrapper = mount(IntimacyItem, {
                props: {
                    item: {
                        id: 'sandalwoodBracelet',
                        name: 'Сандаловый браслет',
                        icon: '/icons/sandalwood-bracelet.png',
                        bgColor: '/bg/orange.png',
                        description: 'Увеличивает близость'
                    },
                    value: 0,
                    total: 0
                }
            })

            const input = wrapper.find('input')
            expect(input.element.value).toBe('0')
            expect(wrapper.text()).toContain('Сандаловый браслет')

            const cells = wrapper.findAll('td')
            expect(cells[3].text()).toBe('0')
        })
    })
})