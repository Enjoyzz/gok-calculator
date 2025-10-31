import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CharmItem from '@/views/CharmItem.vue'
import { SharedKeySymbol } from '@/data/keys.js'

describe('CharmItem.vue', () => {
    let isSharedView
    let mockItem
    let mockValue
    let mockTotal

    beforeEach(() => {
        isSharedView = ref(false)
        mockItem = {
            id: 'blueHadak',
            name: 'Синий хадак',
            description: 'Добавляет всем вашим наложницам по 1-3 ед. обаяния',
            icon: '/test-icon.png',
            bgColor: 'red',
            approximately: true
        }
        mockValue = 5
        mockTotal = 22
    })

    const createWrapper = (props = {}) => {
        return mount(CharmItem, {
            props: {
                item: mockItem,
                value: mockValue,
                total: mockTotal,
                ...props
            },
            global: {
                provide: {
                    [SharedKeySymbol]: { isSharedView }
                }
            }
        })
    }

    describe('Initialization and rendering', () => {
        it('should initialize and render correctly', () => {
            const wrapper = createWrapper()

            expect(wrapper.exists()).toBe(true)
            expect(wrapper.find('tr').exists()).toBe(true)
        })

        it('should render item icon with correct background', () => {
            const wrapper = createWrapper()
            const iconDiv = wrapper.find('.icon .bg')

            expect(iconDiv.exists()).toBe(true)
            expect(iconDiv.attributes('style')).toContain(`background-image: url("${mockItem.bgColor}")`)
        })

        it('should render item icon image', () => {
            const wrapper = createWrapper()
            const iconImg = wrapper.find('.icon img')

            expect(iconImg.exists()).toBe(true)
            expect(iconImg.attributes('src')).toBe(mockItem.icon)
            expect(iconImg.attributes('alt')).toBe(mockItem.name)
        })

        it('should render item name and description', () => {
            const wrapper = createWrapper()
            const textCell = wrapper.findAll('td').at(1)

            expect(textCell.text()).toContain(mockItem.name)
            expect(textCell.text()).toContain(mockItem.description)
        })

        it('should render input with correct value', () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            expect(input.exists()).toBe(true)
            expect(Number(input.element.value)).toBe(mockValue)
        })

        it('should render total with approximately symbol when enabled', () => {
            const wrapper = createWrapper()
            const totalCell = wrapper.findAll('td').at(3)

            expect(totalCell.text()).toBe(`~ ${mockTotal}`)
        })

        it('should render total without approximately symbol when disabled', () => {
            const wrapper = createWrapper({
                item: { ...mockItem, approximately: false }
            })
            const totalCell = wrapper.findAll('td').at(3)

            expect(totalCell.text()).toBe(mockTotal.toString())
        })
    })

    describe('Input behavior', () => {
        it('should select all text when input is clicked', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')
            const selectSpy = vi.spyOn(input.element, 'select')

            await input.trigger('click')

            expect(selectSpy).toHaveBeenCalled()
        })

        it('should emit update event when input value changes', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')
            const newValue = 10

            await input.setValue(newValue)

            expect(wrapper.emitted('update')).toBeTruthy()
            expect(wrapper.emitted('update')[0]).toEqual([mockItem.id, newValue])
        })

        it('should handle negative input values by converting to zero', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            await input.setValue(-5)

            expect(wrapper.emitted('update')[0]).toEqual([mockItem.id, 0])
        })

        it('should handle non-numeric input by converting to zero', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            // Simulate non-numeric input by setting value to empty string
            input.element.value = ''
            await input.trigger('input')

            expect(wrapper.emitted('update')[0]).toEqual([mockItem.id, 0])
        })

        it('should handle decimal input by converting to integer', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            await input.setValue(7.8)

            expect(wrapper.emitted('update')[0]).toEqual([mockItem.id, 7])
        })
    })

    describe('Shared view mode', () => {
        it('should disable input in shared view', () => {
            isSharedView.value = true
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            expect(input.attributes('disabled')).toBeDefined()
        })

        it('should enable input in normal view', () => {
            isSharedView.value = false
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            expect(input.attributes('disabled')).toBeUndefined()
        })

        it('should not emit update events in shared view', async () => {
            isSharedView.value = true
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            await input.setValue(15)

            expect(wrapper.emitted('update')).toBeUndefined()
        })
    })

    describe('Accessibility and UX', () => {
        it('should have min attribute set to 0', () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            expect(input.attributes('min')).toBe('0')
        })

        it('should have proper input type', () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            expect(input.attributes('type')).toBe('number')
        })

        it('should have proper table structure', () => {
            const wrapper = createWrapper()
            const cells = wrapper.findAll('td')

            expect(cells).toHaveLength(4)
            expect(cells[0].classes()).toContain('icon')
            expect(cells[2].classes()).toContain('input-cell')
        })
    })

    describe('Different item types', () => {
        it('should render whiteHadak item correctly', () => {
            const whiteHadakItem = {
                id: 'whiteHadak',
                name: 'Белый хадак',
                description: 'Добавляет всем наложницам 1 ед. обаяния',
                icon: '/white-hadak.png',
                bgColor: 'orange',
                approximately: false
            }

            const wrapper = createWrapper({
                item: whiteHadakItem,
                value: 8,
                total: 24
            })

            expect(wrapper.find('img').attributes('alt')).toBe('Белый хадак')
            expect(wrapper.findAll('td').at(1).text()).toContain('Белый хадак')
            expect(wrapper.findAll('td').at(3).text()).toBe('24') // без ~
        })

        it('should render goldHairpin item correctly', () => {
            const goldHairpinItem = {
                id: 'goldHairpin',
                name: 'Золотая шпилька',
                description: 'Даёт обаяние (5 ед.) одной случайной наложнице',
                icon: '/gold-hairpin.png',
                bgColor: 'orange',
                approximately: false
            }

            const wrapper = createWrapper({
                item: goldHairpinItem,
                value: 3,
                total: 15
            })

            expect(wrapper.find('img').attributes('alt')).toBe('Золотая шпилька')
            expect(wrapper.findAll('td').at(3).text()).toBe('15')
        })

        it('should render perfume item correctly', () => {
            const perfumeItem = {
                id: 'perfume',
                name: 'Османтусовые духи',
                description: 'Обаяние наложницы +1 ед.',
                icon: '/perfume.png',
                bgColor: 'blue',
                approximately: false
            }

            const wrapper = createWrapper({
                item: perfumeItem,
                value: 12,
                total: 12
            })

            expect(wrapper.find('img').attributes('alt')).toBe('Османтусовые духи')
            expect(wrapper.findAll('td').at(1).text()).toContain('Османтусовые духи')
        })
    })

    describe('Edge cases', () => {
        it('should handle zero value correctly', () => {
            const wrapper = createWrapper({ value: 0 })
            const input = wrapper.find('input[type="number"]')

            expect(Number(input.element.value)).toBe(0)
        })

        it('should handle very large values', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')
            const largeValue = 999999

            await input.setValue(largeValue)

            expect(wrapper.emitted('update')[0]).toEqual([mockItem.id, largeValue])
        })

        it('should handle item with missing properties gracefully', () => {
            const minimalItem = {
                id: 'testItem',
                name: 'Test Item',
                icon: '/test.png'
            }

            const wrapper = createWrapper({ item: minimalItem })

            expect(wrapper.exists()).toBe(true)
            expect(wrapper.find('img').attributes('alt')).toBe('Test Item')
        })
    })

    describe('Event consistency', () => {
        it('should emit consistent update events for multiple changes', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')

            await input.setValue(10)
            await input.setValue(20)
            await input.setValue(30)

            const emittedEvents = wrapper.emitted('update')
            expect(emittedEvents).toHaveLength(3)
            expect(emittedEvents[0]).toEqual([mockItem.id, 10])
            expect(emittedEvents[1]).toEqual([mockItem.id, 20])
            expect(emittedEvents[2]).toEqual([mockItem.id, 30])
        })

        it('should not emit update event when value is same', async () => {
            const wrapper = createWrapper({ value: 5 })

            // Change prop externally - should not emit event
            await wrapper.setProps({ value: 10 })

            expect(wrapper.emitted('update')).toBeUndefined()
        })
    })
})