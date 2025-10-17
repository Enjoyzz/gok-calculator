import { mount } from '@vue/test-utils'
import CalculatorTabs from '@/components/CalculatorTabs.vue'
import CharmTab from '@/components/CharmTab.vue'
import IntimacyTab from '@/components/IntimacyTab.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('CalculatorTabs.vue', () => {
    const defaultProps = {
        concubines: 5,
        charmItems: {
            blueHadak: 10,
            silverHairpin: 5,
            chests: 3,
            forage: 20
        },
        intimacyItems: {
            ordos: 8,
            sandalwoodBracelet: 4,
            forage: 15
        },
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
        wrapper = mount(CalculatorTabs, {
            props: defaultProps
        })
    })

    describe('rendering', () => {
        it('should render both tabs', () => {
            const tabs = wrapper.findAll('.tab')

            expect(tabs).toHaveLength(2)
            expect(tabs[0].text()).toBe('Обаяние')
            expect(tabs[1].text()).toBe('Близость')
        })

        it('should set first tab as active by default', () => {
            const tabs = wrapper.findAll('.tab')

            expect(tabs[0].classes()).toContain('active')
            expect(tabs[1].classes()).not.toContain('active')
        })

        it('should render CharmTab by default', () => {
            const charmTab = wrapper.findComponent(CharmTab)
            const intimacyTab = wrapper.findComponent(IntimacyTab)

            expect(charmTab.exists()).toBe(true)
            expect(intimacyTab.exists()).toBe(false)
        })
    })

    describe('tab switching', () => {
        it('should switch to intimacy tab when clicked', async () => {
            const tabs = wrapper.findAll('.tab')

            await tabs[1].trigger('click')

            // Проверяем классы активного таба
            expect(tabs[0].classes()).not.toContain('active')
            expect(tabs[1].classes()).toContain('active')

            // Проверяем отображение компонентов
            const charmTab = wrapper.findComponent(CharmTab)
            const intimacyTab = wrapper.findComponent(IntimacyTab)

            expect(charmTab.exists()).toBe(false)
            expect(intimacyTab.exists()).toBe(true)
        })

        it('should switch back to charm tab when clicked', async () => {
            // Сначала переключаем на intimacy
            const tabs = wrapper.findAll('.tab')
            await tabs[1].trigger('click')

            // Возвращаемся на charm
            await tabs[0].trigger('click')

            expect(tabs[0].classes()).toContain('active')
            expect(tabs[1].classes()).not.toContain('active')

            const charmTab = wrapper.findComponent(CharmTab)
            const intimacyTab = wrapper.findComponent(IntimacyTab)

            expect(charmTab.exists()).toBe(true)
            expect(intimacyTab.exists()).toBe(false)
        })
    })

    describe('props passing', () => {
        it('should pass correct props to CharmTab', () => {
            const charmTab = wrapper.findComponent(CharmTab)

            expect(charmTab.props()).toEqual({
                items: defaultProps.charmItems,
                formulas: defaultProps.formulas.charm,
                concubines: defaultProps.concubines
            })
        })

        it('should pass correct props to IntimacyTab when active', async () => {
            // Переключаем на intimacy tab
            await wrapper.findAll('.tab')[1].trigger('click')

            const intimacyTab = wrapper.findComponent(IntimacyTab)

            expect(intimacyTab.props()).toEqual({
                items: defaultProps.intimacyItems,
                formulas: defaultProps.formulas.intimacy,
                concubines: defaultProps.concubines
            })
        })
    })

    describe('events emitting', () => {
        it('should emit update-charm-items event from CharmTab', async () => {
            const charmTab = wrapper.findComponent(CharmTab)
            const testEventData = { blueHadak: 15, silverHairpin: 8 }

            charmTab.vm.$emit('update-items', testEventData)

            expect(wrapper.emitted('update-charm-items')).toBeTruthy()
            expect(wrapper.emitted('update-charm-items')[0]).toEqual([testEventData])
        })

        it('should emit update-intimacy-items event from IntimacyTab', async () => {
            // Переключаем на intimacy tab
            await wrapper.findAll('.tab')[1].trigger('click')

            const intimacyTab = wrapper.findComponent(IntimacyTab)
            const testEventData = { ordos: 12, sandalwoodBracelet: 6 }

            intimacyTab.vm.$emit('update-items', testEventData)

            expect(wrapper.emitted('update-intimacy-items')).toBeTruthy()
            expect(wrapper.emitted('update-intimacy-items')[0]).toEqual([testEventData])
        })
    })

    describe('conditional rendering', () => {
        it('should not render IntimacyTab when charm tab is active', () => {
            const intimacyTab = wrapper.findComponent(IntimacyTab)
            expect(intimacyTab.exists()).toBe(false)
        })

        it('should not render CharmTab when intimacy tab is active', async () => {
            await wrapper.findAll('.tab')[1].trigger('click')

            const charmTab = wrapper.findComponent(CharmTab)
            expect(charmTab.exists()).toBe(false)
        })
    })

    describe('accessibility', () => {
        it('should have proper tab structure', () => {
            const tabs = wrapper.findAll('.tab')

            tabs.forEach(tab => {
                expect(tab.attributes('role')).toBeUndefined() // или 'tab' если добавите
                expect(tab.attributes('tabindex')).toBeUndefined() // или '0' если добавите
            })
        })
    })
})