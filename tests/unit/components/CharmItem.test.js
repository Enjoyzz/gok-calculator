import { mount } from '@vue/test-utils'
import CharmItem from './CharmItem.vue'

describe('CharmItem', () => {
    const mockItem = {
        id: 'blueHadak',
        name: 'Синий хадак',
        description: 'Добавляет обаяние',
        icon: '/test-icon.png',
        bgColor: '/test-bg.png',
        approximately: true
    }

    const mockProvide = {
        [Symbol()]: { isSharedView: false }
    }

    it('should render item with correct data', () => {
        const wrapper = mount(CharmItem, {
            props: {
                item: mockItem,
                value: 5,
                total: 25
            },
            global: {
                provide: mockProvide
            }
        })

        expect(wrapper.text()).toContain('Синий хадак')
        expect(wrapper.text()).toContain('Добавляет обаяние')
        expect(wrapper.find('input').element.value).toBe('5')
        expect(wrapper.text()).toContain('~ 25')
    })

    it('should emit update event on input change', async () => {
        const wrapper = mount(CharmItem, {
            props: {
                item: mockItem,
                value: 5,
                total: 25
            },
            global: {
                provide: mockProvide
            }
        })

        const input = wrapper.find('input')
        await input.setValue(10)

        expect(wrapper.emitted('update')).toBeTruthy()
        expect(wrapper.emitted('update')[0]).toEqual(['blueHadak', 10])
    })

    it('should not allow negative values', async () => {
        const wrapper = mount(CharmItem, {
            props: {
                item: mockItem,
                value: 5,
                total: 25
            },
            global: {
                provide: mockProvide
            }
        })

        const input = wrapper.find('input')
        await input.setValue(-5)

        expect(wrapper.emitted('update')[0]).toEqual(['blueHadak', 0])
    })

    it('should disable input in shared view', () => {
        const sharedProvide = {
            [Symbol()]: { isSharedView: true }
        }

        const wrapper = mount(CharmItem, {
            props: {
                item: mockItem,
                value: 5,
                total: 25
            },
            global: {
                provide: sharedProvide
            }
        })

        expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('should select all text on input click', async () => {
        const wrapper = mount(CharmItem, {
            props: {
                item: mockItem,
                value: 5,
                total: 25
            },
            global: {
                provide: mockProvide
            }
        })

        const input = wrapper.find('input')
        const selectSpy = vi.spyOn(input.element, 'select')

        await input.trigger('click')

        expect(selectSpy).toHaveBeenCalled()
    })
})