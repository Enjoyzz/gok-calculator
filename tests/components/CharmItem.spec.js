import { mount } from '@vue/test-utils'
import CharmItem from '@/components/CharmItem.vue'
import { describe, it, expect } from 'vitest'

describe('CharmItem.vue', () => {
    const defaultProps = {
        item: {
            id: 'blueHadak',
            name: 'Синий хадак',
            icon: '/icons/blue-hadak.png',
            bgColor: '/bg/blue.png',
            description: 'Дает очки обаяния'
        },
        value: 10,
        total: 75
    }

    describe('rendering', () => {
        it('should render item name and description', () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            expect(wrapper.text()).toContain('Синий хадак')
            expect(wrapper.text()).toContain('Дает очки обаяния')
        })

        it('should render icon with background', () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const bgDiv = wrapper.find('.bg')
            const img = wrapper.find('img')

            expect(bgDiv.attributes('style')).toContain(`url("${defaultProps.item.bgColor}")`)
            expect(img.attributes('src')).toBe(defaultProps.item.icon)
            expect(img.attributes('alt')).toBe(defaultProps.item.name)
        })

        it('should render input with current value', () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            expect(input.element.value).toBe('10')
            expect(input.attributes('type')).toBe('number')
            expect(input.attributes('min')).toBe('0')
        })

        it('should render total value', () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const cells = wrapper.findAll('td')
            expect(cells[3].text()).toBe('75')
        })
    })

    describe('events', () => {
        it('should emit update event when input changes', async () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('15')

            expect(wrapper.emitted('update')).toBeTruthy()
            expect(wrapper.emitted('update')[0]).toEqual(['blueHadak', 15])
        })

        it('should handle zero when input is invalid', async () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('invalid')

            expect(wrapper.emitted('update')[0]).toEqual(['blueHadak', 0])
        })

        /* TODO */
        it('should handle negative values as zero', async () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('-5')

            expect(wrapper.emitted('update')[0]).toEqual(['blueHadak', 0])
        })

        it('should handle decimal values', async () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            await input.setValue('12.5')

            expect(wrapper.emitted('update')[0]).toEqual(['blueHadak', 12])
        })
    })

    describe('accessibility', () => {
        it('should have proper input attributes', () => {
            const wrapper = mount(CharmItem, {
                props: defaultProps
            })

            const input = wrapper.find('input')
            expect(input.attributes('min')).toBe('0')
            expect(input.attributes('type')).toBe('number')
        })
    })

    describe('with different props', () => {
        it('should render correctly with zero values', () => {
            const wrapper = mount(CharmItem, {
                props: {
                    item: {
                        id: 'silverHairpin',
                        name: 'Серебряная шпилька',
                        icon: '/icons/silver-hairpin.png',
                        bgColor: '/bg/silver.png',
                        description: 'Увеличивает обаяние'
                    },
                    value: 0,
                    total: 0
                }
            })

            const input = wrapper.find('input')
            expect(input.element.value).toBe('0')
            expect(wrapper.text()).toContain('Серебряная шпилька')
            expect(wrapper.findAll('td')[3].text()).toBe('0')
        })

        it('should render correctly with large values', () => {
            const wrapper = mount(CharmItem, {
                props: {
                    ...defaultProps,
                    value: 999,
                    total: 2997
                }
            })

            const input = wrapper.find('input')
            expect(input.element.value).toBe('999')
            expect(wrapper.findAll('td')[3].text()).toBe('2997')
        })
    })
})