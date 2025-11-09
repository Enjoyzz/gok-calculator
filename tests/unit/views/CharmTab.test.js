import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CharmTab from '@/views/CharmTab.vue'
import CharmItem from '@/views/CharmItem.vue'
import ShareButton from '@/components/ShareButton.vue'
import { charmItemsConfig } from '@/data/charmItemsConfig.js'
import { SharedKeySymbol, calcValuesKey, calcSettingsKey } from '@/data/keys.js'

describe('CharmTab.vue', () => {
    let calcValues
    let calcSettings
    let isSharedView

    beforeEach(() => {
        calcValues = ref({
            concubines: 3,
            blueHadak: 5,
            whiteHadak: 10,
            goldHairpin: 2,
            silverHairpin: 4,
            perfume: 8,
            chests: 3,
            forage: 20
        })

        calcSettings = ref({
            charm: {
                blueHadak: 1.5,
                silverHairpin: 3,
                chests: 2.2,
                forage: 1.5
            }
        })

        isSharedView = ref(false)
    })

    const createWrapper = () => {
        return mount(CharmTab, {
            global: {
                provide: {
                    [SharedKeySymbol]: { isSharedView },
                    [calcValuesKey]: { calcValues },
                    [calcSettingsKey]: { calcSettings }
                },
                stubs: {
                    ShareButton: true
                }
            }
        })
    }

    describe('Initialization', () => {
        it('should initialize and render correctly', () => {
            const wrapper = createWrapper()

            expect(wrapper.exists()).toBe(true)
            expect(wrapper.find('.tab-content').exists()).toBe(true)
            expect(wrapper.find('table').exists()).toBe(true)
        })

        it('should render all charm items from config', () => {
            const wrapper = createWrapper()

            const charmItems = wrapper.findAllComponents(CharmItem)
            expect(charmItems).toHaveLength(charmItemsConfig.length)
        })

        it('should render ShareButton when not in shared view', () => {
            isSharedView.value = false
            const wrapper = createWrapper()

            expect(wrapper.findComponent(ShareButton).exists()).toBe(true)
        })

        it('should not render ShareButton when in shared view', () => {
            isSharedView.value = true
            const wrapper = createWrapper()

            expect(wrapper.findComponent(ShareButton).exists()).toBe(false)
        })
    })

    describe('Totals calculation', () => {
        it('should calculate blueHadak total correctly', () => {
            calcValues.value.concubines = 3
            calcValues.value.blueHadak = 5
            calcSettings.value.charm.blueHadak = 1.5

            const wrapper = createWrapper()

            // blueHadak: Math.floor(5 * 3 * 1.5) = Math.floor(22.5) = 22
            expect(wrapper.vm.totals.blueHadak).toBe(22)
        })

        it('should calculate whiteHadak total correctly', () => {
            calcValues.value.concubines = 3
            calcValues.value.whiteHadak = 10

            const wrapper = createWrapper()

            // whiteHadak: 10 * 3 * 1 = 30
            expect(wrapper.vm.totals.whiteHadak).toBe(30)
        })

        it('should calculate goldHairpin total correctly', () => {
            calcValues.value.goldHairpin = 2

            const wrapper = createWrapper()

            // goldHairpin: 2 * 5 = 10
            expect(wrapper.vm.totals.goldHairpin).toBe(10)
        })

        it('should calculate silverHairpin total correctly', () => {
            calcValues.value.silverHairpin = 4
            calcSettings.value.charm.silverHairpin = 3

            const wrapper = createWrapper()

            // silverHairpin: Math.floor(4 * 3) = 12
            expect(wrapper.vm.totals.silverHairpin).toBe(12)
        })

        it('should calculate perfume total correctly', () => {
            calcValues.value.perfume = 8

            const wrapper = createWrapper()

            // perfume: 8 * 1 = 8
            expect(wrapper.vm.totals.perfume).toBe(8)
        })

        it('should calculate chests total correctly', () => {
            calcValues.value.chests = 3
            calcSettings.value.charm.chests = 2.2

            const wrapper = createWrapper()

            // chests: Math.floor(3 * 2.2) = Math.floor(6.6) = 6
            expect(wrapper.vm.totals.chests).toBe(6)
        })

        it('should calculate forage total correctly', () => {
            calcValues.value.forage = 20
            calcSettings.value.charm.forage = 1.5

            const wrapper = createWrapper()

            // forage: Math.floor(20 * 1.5) = 30
            expect(wrapper.vm.totals.forage).toBe(30)
        })
    })

    describe('Total sum calculation', () => {
        it('should calculate correct total sum', () => {
            calcValues.value.concubines = 2
            calcValues.value.blueHadak = 4
            calcValues.value.whiteHadak = 6
            calcValues.value.goldHairpin = 1
            calcValues.value.silverHairpin = 3
            calcValues.value.perfume = 5
            calcValues.value.chests = 2
            calcValues.value.forage = 10

            calcSettings.value.charm.blueHadak = 2
            calcSettings.value.charm.silverHairpin = 4
            calcSettings.value.charm.chests = 3
            calcSettings.value.charm.forage = 2

            const wrapper = createWrapper()

            // blueHadak: Math.floor(4 * 2 * 2) = 16
            // whiteHadak: 6 * 2 = 12
            // goldHairpin: 1 * 5 = 5
            // silverHairpin: Math.floor(3 * 4) = 12
            // perfume: 5 * 1 = 5
            // chests: Math.floor(2 * 3) = 6
            // forage: Math.floor(10 * 2) = 20
            // Total: 16 + 12 + 5 + 12 + 5 + 6 + 20 = 76
            expect(wrapper.vm.total).toBe(76)
        })

        it('should display total in template', () => {
            const wrapper = createWrapper()
            const totalRow = wrapper.find('.total-row')

            expect(totalRow.exists()).toBe(true)
            expect(totalRow.text()).toContain('ИТОГ')
            expect(totalRow.text()).toContain(wrapper.vm.total.toString())
        })
    })

    describe('Event handling', () => {
        it('should emit update-items event when updateItem is called', async () => {
            const wrapper = createWrapper()

            const testId = 'blueHadak'
            const testValue = 15

            wrapper.vm.updateItem(testId, testValue)

            expect(wrapper.emitted('update-items')).toBeTruthy()
            expect(wrapper.emitted('update-items')[0]).toEqual([
                { ...calcValues.value, [testId]: testValue }
            ])
        })

        it('should pass correct props to CharmItem components', () => {
            const wrapper = createWrapper()

            const firstCharmItem = wrapper.findAllComponents(CharmItem)[0]
            const expectedItem = charmItemsConfig[0]

            expect(firstCharmItem.props('item')).toEqual(expectedItem)
            expect(firstCharmItem.props('value')).toBe(calcValues.value[expectedItem.id])
            expect(firstCharmItem.props('total')).toBe(wrapper.vm.totals[expectedItem.id])
        })
    })

    describe('Formula info display', () => {
        it('should display formula information', () => {
            const wrapper = createWrapper()
            const formulaInfo = wrapper.find('.formula-info')

            expect(formulaInfo.exists()).toBe(true)
            expect(formulaInfo.text()).toContain('Формулы расчета:')
            expect(formulaInfo.text()).toContain(`Синий хадак: количество × количество наложниц × ${calcSettings.value.charm.blueHadak}`)
            expect(formulaInfo.text()).toContain(`Серебряная шпилька: количество × ${calcSettings.value.charm.silverHairpin}`)
            expect(formulaInfo.text()).toContain(`Сундуки: количество × ${calcSettings.value.charm.chests}`)
            expect(formulaInfo.text()).toContain(`Фураж: количество × ${calcSettings.value.charm.forage}`)
        })

        it('should update formula info when settings change', async () => {
            const wrapper = createWrapper()

            calcSettings.value.charm.blueHadak = 2.5
            calcSettings.value.charm.silverHairpin = 4

            await wrapper.vm.$nextTick()

            const formulaInfo = wrapper.find('.formula-info')
            expect(formulaInfo.text()).toContain('Синий хадак: количество × количество наложниц × 2.5')
            expect(formulaInfo.text()).toContain('Серебряная шпилька: количество × 4')
        })
    })

    describe('Reactivity', () => {
        it('should recalculate totals when calcValues changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            calcValues.value.blueHadak = 10
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
            expect(wrapper.vm.totals.blueHadak).toBe(Math.floor(10 * calcValues.value.concubines * calcSettings.value.charm.blueHadak))
        })

        it('should recalculate totals when calcSettings changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            calcSettings.value.charm.blueHadak = 2
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
            expect(wrapper.vm.totals.blueHadak).toBe(Math.floor(calcValues.value.blueHadak * calcValues.value.concubines * 2))
        })

        it('should recalculate totals when concubines changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            calcValues.value.concubines = 5
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
        })
    })

    describe('Edge cases', () => {
        it('should handle zero values correctly', () => {
            calcValues.value = {
                concubines: 1,
                blueHadak: 0,
                whiteHadak: 0,
                goldHairpin: 0,
                silverHairpin: 0,
                perfume: 0,
                chests: 0,
                forage: 0
            }

            const wrapper = createWrapper()

            expect(wrapper.vm.total).toBe(0)
            Object.values(wrapper.vm.totals).forEach(total => {
                expect(total).toBe(0)
            })
        })

        it('should handle decimal values in formulas', () => {
            calcValues.value.blueHadak = 3
            calcValues.value.concubines = 2
            calcSettings.value.charm.blueHadak = 1.7 // 3 * 2 * 1.7 = 10.2 -> Math.floor = 10

            const wrapper = createWrapper()

            expect(wrapper.vm.totals.blueHadak).toBe(10)
        })

        it('should handle large numbers', () => {
            calcValues.value.concubines = 100
            calcValues.value.blueHadak = 1000
            calcSettings.value.charm.blueHadak = 3

            const wrapper = createWrapper()

            expect(wrapper.vm.totals.blueHadak).toBe(300000) // 1000 * 100 * 3
        })
    })
})