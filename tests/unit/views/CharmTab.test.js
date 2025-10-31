import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CharmTab from '@/views/CharmTab.vue'
import CharmItem from '@/views/CharmItem.vue'
import ShareButton from '@/components/ShareButton.vue'
import { charmItemsConfig } from '@/data/charmItemsConfig.js'
import { SharedKeySymbol, calculatorDataKey, formulaSettingsKey } from '@/data/keys.js'

describe('CharmTab.vue', () => {
    let calculatorData
    let formulaSettings
    let isSharedView

    beforeEach(() => {
        calculatorData = ref({
            concubines: 3,
            blueHadak: 5,
            whiteHadak: 10,
            goldHairpin: 2,
            silverHairpin: 4,
            perfume: 8,
            chests: 3,
            forage: 20
        })

        formulaSettings = ref({
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
                    [calculatorDataKey]: { calculatorData },
                    [formulaSettingsKey]: { formulaSettings }
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
            calculatorData.value.concubines = 3
            calculatorData.value.blueHadak = 5
            formulaSettings.value.charm.blueHadak = 1.5

            const wrapper = createWrapper()

            // blueHadak: Math.floor(5 * 3 * 1.5) = Math.floor(22.5) = 22
            expect(wrapper.vm.totals.blueHadak).toBe(22)
        })

        it('should calculate whiteHadak total correctly', () => {
            calculatorData.value.concubines = 3
            calculatorData.value.whiteHadak = 10

            const wrapper = createWrapper()

            // whiteHadak: 10 * 3 * 1 = 30
            expect(wrapper.vm.totals.whiteHadak).toBe(30)
        })

        it('should calculate goldHairpin total correctly', () => {
            calculatorData.value.goldHairpin = 2

            const wrapper = createWrapper()

            // goldHairpin: 2 * 5 = 10
            expect(wrapper.vm.totals.goldHairpin).toBe(10)
        })

        it('should calculate silverHairpin total correctly', () => {
            calculatorData.value.silverHairpin = 4
            formulaSettings.value.charm.silverHairpin = 3

            const wrapper = createWrapper()

            // silverHairpin: Math.floor(4 * 3) = 12
            expect(wrapper.vm.totals.silverHairpin).toBe(12)
        })

        it('should calculate perfume total correctly', () => {
            calculatorData.value.perfume = 8

            const wrapper = createWrapper()

            // perfume: 8 * 1 = 8
            expect(wrapper.vm.totals.perfume).toBe(8)
        })

        it('should calculate chests total correctly', () => {
            calculatorData.value.chests = 3
            formulaSettings.value.charm.chests = 2.2

            const wrapper = createWrapper()

            // chests: Math.floor(3 * 2.2) = Math.floor(6.6) = 6
            expect(wrapper.vm.totals.chests).toBe(6)
        })

        it('should calculate forage total correctly', () => {
            calculatorData.value.forage = 20
            formulaSettings.value.charm.forage = 1.5

            const wrapper = createWrapper()

            // forage: Math.floor(20 * 1.5) = 30
            expect(wrapper.vm.totals.forage).toBe(30)
        })
    })

    describe('Total sum calculation', () => {
        it('should calculate correct total sum', () => {
            calculatorData.value.concubines = 2
            calculatorData.value.blueHadak = 4
            calculatorData.value.whiteHadak = 6
            calculatorData.value.goldHairpin = 1
            calculatorData.value.silverHairpin = 3
            calculatorData.value.perfume = 5
            calculatorData.value.chests = 2
            calculatorData.value.forage = 10

            formulaSettings.value.charm.blueHadak = 2
            formulaSettings.value.charm.silverHairpin = 4
            formulaSettings.value.charm.chests = 3
            formulaSettings.value.charm.forage = 2

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
                { ...calculatorData.value, [testId]: testValue }
            ])
        })

        it('should pass correct props to CharmItem components', () => {
            const wrapper = createWrapper()

            const firstCharmItem = wrapper.findAllComponents(CharmItem)[0]
            const expectedItem = charmItemsConfig[0]

            expect(firstCharmItem.props('item')).toEqual(expectedItem)
            expect(firstCharmItem.props('value')).toBe(calculatorData.value[expectedItem.id])
            expect(firstCharmItem.props('total')).toBe(wrapper.vm.totals[expectedItem.id])
        })
    })

    describe('Formula info display', () => {
        it('should display formula information', () => {
            const wrapper = createWrapper()
            const formulaInfo = wrapper.find('.formula-info')

            expect(formulaInfo.exists()).toBe(true)
            expect(formulaInfo.text()).toContain('Формулы расчета:')
            expect(formulaInfo.text()).toContain(`Синий хадак: количество × количество наложниц × ${formulaSettings.value.charm.blueHadak}`)
            expect(formulaInfo.text()).toContain(`Серебряная шпилька: количество × ${formulaSettings.value.charm.silverHairpin}`)
            expect(formulaInfo.text()).toContain(`Сундуки: количество × ${formulaSettings.value.charm.chests}`)
            expect(formulaInfo.text()).toContain(`Фураж: количество × ${formulaSettings.value.charm.forage}`)
        })

        it('should update formula info when settings change', async () => {
            const wrapper = createWrapper()

            formulaSettings.value.charm.blueHadak = 2.5
            formulaSettings.value.charm.silverHairpin = 4

            await wrapper.vm.$nextTick()

            const formulaInfo = wrapper.find('.formula-info')
            expect(formulaInfo.text()).toContain('Синий хадак: количество × количество наложниц × 2.5')
            expect(formulaInfo.text()).toContain('Серебряная шпилька: количество × 4')
        })
    })

    describe('Reactivity', () => {
        it('should recalculate totals when calculatorData changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            calculatorData.value.blueHadak = 10
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
            expect(wrapper.vm.totals.blueHadak).toBe(Math.floor(10 * calculatorData.value.concubines * formulaSettings.value.charm.blueHadak))
        })

        it('should recalculate totals when formulaSettings changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            formulaSettings.value.charm.blueHadak = 2
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
            expect(wrapper.vm.totals.blueHadak).toBe(Math.floor(calculatorData.value.blueHadak * calculatorData.value.concubines * 2))
        })

        it('should recalculate totals when concubines changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            calculatorData.value.concubines = 5
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
        })
    })

    describe('Edge cases', () => {
        it('should handle zero values correctly', () => {
            calculatorData.value = {
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
            calculatorData.value.blueHadak = 3
            calculatorData.value.concubines = 2
            formulaSettings.value.charm.blueHadak = 1.7 // 3 * 2 * 1.7 = 10.2 -> Math.floor = 10

            const wrapper = createWrapper()

            expect(wrapper.vm.totals.blueHadak).toBe(10)
        })

        it('should handle large numbers', () => {
            calculatorData.value.concubines = 100
            calculatorData.value.blueHadak = 1000
            formulaSettings.value.charm.blueHadak = 3

            const wrapper = createWrapper()

            expect(wrapper.vm.totals.blueHadak).toBe(300000) // 1000 * 100 * 3
        })
    })
})