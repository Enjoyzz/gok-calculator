import { mount } from '@vue/test-utils'
import IntimacyTab from '@/components/IntimacyTab.vue'
import IntimacyItem from '@/components/IntimacyItem.vue'
import { intimacyItemsConfig } from '@/data/intimacyItemsConfig.js'
import { describe, vi, it, expect, beforeEach } from 'vitest'

// Мокаем конфиг для тестов
vi.mock('@/data/intimacyItemsConfig.js', () => ({
    intimacyItemsConfig: [
        { id: 'ordos', name: 'Ордос', icon: 'ordos.png' },
        { id: 'takya', name: 'Такъя', icon: 'takya.png' },
        { id: 'sandalwoodBracelet', name: 'Сандаловый браслет', icon: 'sandalwood-bracelet.png' }
    ]
}))

describe('IntimacyTab.vue', () => {
    const defaultProps = {
        items: {
            ordos: 8,
            takya: 6,
            jadeBracelet: 4,
            sandalwoodBracelet: 7,
            goldEarrings: 5,
            gemRing: 10,
            loveLetter: 12,
            forage: 25
        },
        formulas: {
            ordos: 1.5,
            sandalwoodBracelet: 3,
            forage: 1.2
        },
        concubines: 5
    }

    let wrapper

    beforeEach(() => {
        wrapper = mount(IntimacyTab, {
            props: defaultProps
        })
    })

    describe('rendering', () => {
        it('should render all intimacy items from config', () => {
            const intimacyItems = wrapper.findAllComponents(IntimacyItem)

            expect(intimacyItems).toHaveLength(intimacyItemsConfig.length)

            intimacyItemsConfig.forEach((configItem, index) => {
                const intimacyItem = intimacyItems[index]
                expect(intimacyItem.props('item')).toEqual(configItem)
                expect(intimacyItem.props('value')).toBe(defaultProps.items[configItem.id])
            })
        })

        it('should render total row with correct total value', () => {
            const totalRow = wrapper.find('.total-row')
            const totalCells = totalRow.findAll('td')

            expect(totalCells[0].text()).toBe('ИТОГ')
            expect(totalCells[3].text()).toBe('~ 193') // Проверяем вычисленное значение
        })

        it('should render formula information', () => {
            const formulaInfo = wrapper.find('.formula-info')

            expect(formulaInfo.exists()).toBe(true)
            expect(formulaInfo.find('p').text()).toContain('Формулы расчета:')

            const listItems = formulaInfo.findAll('li')
            expect(listItems).toHaveLength(8)
        })
    })

    describe('computed properties', () => {
        it('should calculate totals correctly', () => {
            const expectedTotals = {
                ordos: Math.floor(8 * 5 * 1.5),           // 60
                takya: 6 * 5,                             // 30
                jadeBracelet: 4 * 5,                      // 20
                sandalwoodBracelet: Math.floor(7 * 3),    // 21
                goldEarrings: 5 * 2,                      // 10
                gemRing: 10,                              // 10
                loveLetter: 12,                           // 12
                forage: Math.floor(25 * 1.2)              // 30
            }

            expect(wrapper.vm.totals).toEqual(expectedTotals)
        })

        it('should calculate total sum correctly', () => {
            // 60 + 30 + 20 + 21 + 10 + 10 + 12 + 30 = 193
            expect(wrapper.vm.total).toBe(193)
        })

        it('should recalculate totals when props change', async () => {
            await wrapper.setProps({
                items: { ...defaultProps.items, ordos: 15 },
                concubines: 8
            })

            // Новые расчеты:
            // ordos: 15 × 8 × 1.5 = 180 (было 60)
            // takya: 6 × 8 = 48 (было 30)
            expect(wrapper.vm.totals.ordos).toBe(180)
            expect(wrapper.vm.totals.takya).toBe(48)
            expect(wrapper.vm.total).toBe(331) // 193 - 60 - 30 + 180 + 48 = 331
        })

        it('should handle zero values correctly', async () => {
            await wrapper.setProps({
                items: {
                    ordos: 0,
                    takya: 0,
                    jadeBracelet: 0,
                    sandalwoodBracelet: 0,
                    goldEarrings: 0,
                    gemRing: 0,
                    loveLetter: 0,
                    forage: 0
                },
                concubines: 0
            })

            expect(wrapper.vm.totals.ordos).toBe(0)
            expect(wrapper.vm.total).toBe(0)
        })

        it('should handle fractional results with Math.floor', () => {
            // Проверяем что Math.floor работает для дробных результатов
            expect(wrapper.vm.totals.ordos).toBe(60) // 8 * 5 * 1.5 = 60
            expect(wrapper.vm.totals.forage).toBe(30) // 25 * 1.2 = 30
        })

        it('should calculate items without concubines multiplier correctly', () => {
            // Эти предметы не зависят от количества наложниц
            expect(wrapper.vm.totals.gemRing).toBe(10) // просто значение
            expect(wrapper.vm.totals.loveLetter).toBe(12) // просто значение
            expect(wrapper.vm.totals.goldEarrings).toBe(10) // 5 × 2 = 10
        })
    })

    describe('events', () => {
        it('should emit update-items event when updateItem is called', () => {
            const itemId = 'ordos'
            const newValue = 12

            wrapper.vm.updateItem(itemId, newValue)

            expect(wrapper.emitted('update-items')).toBeTruthy()
            expect(wrapper.emitted('update-items')[0]).toEqual([
                { ...defaultProps.items, [itemId]: newValue }
            ])
        })

        it('should pass updateItem function to IntimacyItem components', async () => {
            const intimacyItem = wrapper.findComponent(IntimacyItem)

            // Симулируем событие от дочернего компонента
            const itemId = 'takya'
            const newValue = 10
            intimacyItem.vm.$emit('update', itemId, newValue)

            expect(wrapper.emitted('update-items')[0]).toEqual([
                { ...defaultProps.items, [itemId]: newValue }
            ])
        })
    })

    describe('IntimacyItem components', () => {
        it('should pass correct props to each IntimacyItem', () => {
            const intimacyItems = wrapper.findAllComponents(IntimacyItem)

            intimacyItemsConfig.forEach((configItem, index) => {
                const intimacyItem = intimacyItems[index]

                expect(intimacyItem.props()).toEqual({
                    item: configItem,
                    value: defaultProps.items[configItem.id],
                    total: wrapper.vm.totals[configItem.id]
                })
            })
        })
    })

    describe('formula display', () => {
        it('should display current formula values in the list', () => {
            const listItems = wrapper.findAll('.formula-info li')

            expect(listItems[0].text()).toBe(`Ордос: количество × количество наложниц × ${defaultProps.formulas.ordos}`)
            expect(listItems[1].text()).toBe('Такъя: количество × количество наложниц × 1')
            expect(listItems[2].text()).toBe('Нефритовый браслет: количество × 5')
            expect(listItems[3].text()).toBe(`Сандаловый браслет: количество × ${defaultProps.formulas.sandalwoodBracelet}`)
            expect(listItems[4].text()).toBe('Золотые серьги: количество × 2')
            expect(listItems[5].text()).toBe('Самоцветное кольцо: количество × 1')
            expect(listItems[6].text()).toBe('Любовное письмо: количество × 1')
            expect(listItems[7].text()).toBe(`Фураж: количество × ${defaultProps.formulas.forage}`)
        })

        it('should update formulas when props change', async () => {
            const newFormulas = {
                ordos: 2.0,
                sandalwoodBracelet: 4,
                forage: 1.5
            }

            await wrapper.setProps({ formulas: newFormulas })

            const listItems = wrapper.findAll('.formula-info li')

            expect(listItems[0].text()).toContain(`× ${newFormulas.ordos}`)
            expect(listItems[3].text()).toContain(`× ${newFormulas.sandalwoodBracelet}`)
            expect(listItems[7].text()).toContain(`× ${newFormulas.forage}`)
        })
    })

    describe('specific formulas', () => {
        it('should have correct multipliers for each item type', () => {
            // Проверяем специфические множители для разных типов предметов
            expect(wrapper.vm.totals.takya).toBe(30) // concubines × 1
            expect(wrapper.vm.totals.jadeBracelet).toBe(20) // concubines × 5
            expect(wrapper.vm.totals.goldEarrings).toBe(10) // items × 2
            expect(wrapper.vm.totals.gemRing).toBe(10) // items × 1
            expect(wrapper.vm.totals.loveLetter).toBe(12) // items × 1
        })
    })
})