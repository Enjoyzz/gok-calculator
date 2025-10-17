import { mount } from '@vue/test-utils'
import CharmTab from '@/components/CharmTab.vue'
import CharmItem from '@/components/CharmItem.vue'
import { charmItemsConfig } from '@/data/charmItemsConfig.js'
import { describe, it, vi, expect, beforeEach } from 'vitest'

// Мокаем конфиг для тестов
vi.mock('@/data/charmItemsConfig.js', () => ({
    charmItemsConfig: [
        { id: 'blueHadak', name: 'Синий хадак', icon: 'blue-hadak.png' },
        { id: 'whiteHadak', name: 'Белый хадак', icon: 'white-hadak.png' },
        { id: 'silverHairpin', name: 'Серебряная шпилька', icon: 'silver-hairpin.png' }
    ]
}))

describe('CharmTab.vue', () => {
    const defaultProps = {
        items: {
            blueHadak: 10,
            whiteHadak: 5,
            goldHairpin: 3,
            silverHairpin: 8,
            perfume: 15,
            chests: 4,
            forage: 20
        },
        formulas: {
            blueHadak: 1.5,
            silverHairpin: 3,
            chests: 2.2,
            forage: 1.5
        },
        concubines: 5
    }

    let wrapper

    beforeEach(() => {
        wrapper = mount(CharmTab, {
            props: defaultProps
        })
    })

    describe('rendering', () => {
        it('should render all charm items from config', () => {
            const charmItems = wrapper.findAllComponents(CharmItem)

            expect(charmItems).toHaveLength(charmItemsConfig.length)

            charmItemsConfig.forEach((configItem, index) => {
                const charmItem = charmItems[index]
                expect(charmItem.props('item')).toEqual(configItem)
                expect(charmItem.props('value')).toBe(defaultProps.items[configItem.id])
            })
        })

        it('should render total row with correct total value', () => {
            const totalRow = wrapper.find('.total-row')
            const totalCells = totalRow.findAll('td')

            expect(totalCells[0].text()).toBe('ИТОГ')
            // Правильный расчет: 75 + 25 + 15 + 24 + 15 + 8 + 30 = 192
            expect(totalCells[3].text()).toBe('~ 192')
        })

        it('should render formula information', () => {
            const formulaInfo = wrapper.find('.formula-info')

            expect(formulaInfo.exists()).toBe(true)
            expect(formulaInfo.find('p').text()).toContain('Формулы расчета:')

            const listItems = formulaInfo.findAll('li')
            expect(listItems).toHaveLength(7)
        })
    })

    describe('computed properties', () => {
        it('should calculate totals correctly', () => {
            const expectedTotals = {
                blueHadak: Math.floor(10 * 5 * 1.5),        // 75
                whiteHadak: 5 * 5,                          // 25
                goldHairpin: 3 * 5,                         // 15
                silverHairpin: Math.floor(8 * 3),           // 24
                perfume: 15,                                // 15
                chests: Math.floor(4 * 2.2),                // 8
                forage: Math.floor(20 * 1.5)                // 30
            }

            expect(wrapper.vm.totals).toEqual(expectedTotals)
        })

        it('should calculate total sum correctly', () => {
            // 75 + 25 + 15 + 24 + 15 + 8 + 30 = 192
            expect(wrapper.vm.total).toBe(192)
        })

        it('should recalculate totals when props change', async () => {
            // Сохраняем исходный total для проверки
            const originalTotal = wrapper.vm.total // 192
            const originalBlueHadak = wrapper.vm.totals.blueHadak // 75

            await wrapper.setProps({
                items: { ...defaultProps.items, blueHadak: 20 }, // blueHadak: 10 → 20
                concubines: 10 // concubines: 5 → 10
            })

            // blueHadak: 20 × 10 × 1.5 = 300
            // whiteHadak: 5 × 10 = 50 (увеличилось с 25 до 50!)
            // остальные без изменений
            expect(wrapper.vm.totals.blueHadak).toBe(300)
            expect(wrapper.vm.totals.whiteHadak).toBe(50) // было 25, стало 50
            expect(wrapper.vm.total).toBe(442) // 300 + 50 + 15 + 24 + 15 + 8 + 30 = 442
        })

        it('should handle zero values correctly', async () => {
            await wrapper.setProps({
                items: {
                    blueHadak: 0,
                    whiteHadak: 0,
                    goldHairpin: 0,
                    silverHairpin: 0,
                    perfume: 0,
                    chests: 0,
                    forage: 0
                },
                concubines: 0
            })

            expect(wrapper.vm.totals.blueHadak).toBe(0)
            expect(wrapper.vm.total).toBe(0)
        })

        it('should handle fractional results with Math.floor', () => {
            // Проверяем что Math.floor работает для дробных результатов
            expect(wrapper.vm.totals.chests).toBe(8) // 4 * 2.2 = 8.8 → Math.floor(8.8) = 8
            expect(wrapper.vm.totals.forage).toBe(30) // 20 * 1.5 = 30
        })
    })

    describe('events', () => {
        it('should emit update-items event when updateItem is called', () => {
            const itemId = 'blueHadak'
            const newValue = 15

            wrapper.vm.updateItem(itemId, newValue)

            expect(wrapper.emitted('update-items')).toBeTruthy()
            expect(wrapper.emitted('update-items')[0]).toEqual([
                { ...defaultProps.items, [itemId]: newValue }
            ])
        })
    })

    describe('formula display', () => {
        it('should display current formula values in the list', () => {
            const listItems = wrapper.findAll('.formula-info li')

            expect(listItems[0].text()).toBe(`Синий хадак: количество × количество наложниц × ${defaultProps.formulas.blueHadak}`)
            expect(listItems[1].text()).toBe('Белый хадак: количество × количество наложниц × 1')
            expect(listItems[2].text()).toBe('Золотая шпилька: количество × 5')
        })
    })
})