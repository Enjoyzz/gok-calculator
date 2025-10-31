import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import IntimacyTab from '@/views/IntimacyTab.vue'
import IntimacyItem from '@/views/IntimacyItem.vue'
import ShareButton from '@/components/ShareButton.vue'
import { intimacyItemsConfig } from '@/data/intimacyItemsConfig.js'
import { SharedKeySymbol, calculatorDataKey, formulaSettingsKey } from '@/data/keys.js'

describe('IntimacyTab.vue', () => {
    let calculatorData
    let formulaSettings
    let isSharedView

    beforeEach(() => {
        calculatorData = ref({
            concubines: 3,
            ordos: 5,
            takya: 10,
            jadeBracelet: 2,
            sandalwoodBracelet: 4,
            goldEarrings: 8,
            gemRing: 6,
            loveLetter: 3,
            forage: 20
        })

        formulaSettings = ref({
            intimacy: {
                ordos: 1.5,
                sandalwoodBracelet: 3,
                forage: 1.2
            }
        })

        isSharedView = ref(false)
    })

    const createWrapper = () => {
        return mount(IntimacyTab, {
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

        it('should render all intimacy items from config', () => {
            const wrapper = createWrapper()

            const intimacyItems = wrapper.findAllComponents(IntimacyItem)
            expect(intimacyItems).toHaveLength(intimacyItemsConfig.length)
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
        it('should calculate ordos total correctly', () => {
            calculatorData.value.concubines = 3
            calculatorData.value.ordos = 5
            formulaSettings.value.intimacy.ordos = 1.5

            const wrapper = createWrapper()

            // ordos: Math.floor(5 * 3 * 1.5) = Math.floor(22.5) = 22
            expect(wrapper.vm.totals.ordos).toBe(22)
        })

        it('should calculate takya total correctly', () => {
            calculatorData.value.concubines = 3
            calculatorData.value.takya = 10

            const wrapper = createWrapper()

            // takya: 10 * 3 * 1 = 30
            expect(wrapper.vm.totals.takya).toBe(30)
        })

        it('should calculate jadeBracelet total correctly', () => {
            calculatorData.value.jadeBracelet = 2

            const wrapper = createWrapper()

            // jadeBracelet: 2 * 5 = 10
            expect(wrapper.vm.totals.jadeBracelet).toBe(10)
        })

        it('should calculate sandalwoodBracelet total correctly', () => {
            calculatorData.value.sandalwoodBracelet = 4
            formulaSettings.value.intimacy.sandalwoodBracelet = 3

            const wrapper = createWrapper()

            // sandalwoodBracelet: Math.floor(4 * 3) = 12
            expect(wrapper.vm.totals.sandalwoodBracelet).toBe(12)
        })

        it('should calculate goldEarrings total correctly', () => {
            calculatorData.value.goldEarrings = 8

            const wrapper = createWrapper()

            // goldEarrings: 8 * 2 = 16
            expect(wrapper.vm.totals.goldEarrings).toBe(16)
        })

        it('should calculate gemRing total correctly', () => {
            calculatorData.value.gemRing = 6

            const wrapper = createWrapper()

            // gemRing: 6 * 1 = 6
            expect(wrapper.vm.totals.gemRing).toBe(6)
        })

        it('should calculate loveLetter total correctly', () => {
            calculatorData.value.loveLetter = 3

            const wrapper = createWrapper()

            // loveLetter: 3 * 1 = 3
            expect(wrapper.vm.totals.loveLetter).toBe(3)
        })

        it('should calculate forage total correctly', () => {
            calculatorData.value.forage = 20
            formulaSettings.value.intimacy.forage = 1.2

            const wrapper = createWrapper()

            // forage: Math.floor(20 * 1.2) = 24
            expect(wrapper.vm.totals.forage).toBe(24)
        })
    })

    describe('Total sum calculation', () => {
        it('should calculate correct total sum', () => {
            calculatorData.value.concubines = 2
            calculatorData.value.ordos = 4
            calculatorData.value.takya = 6
            calculatorData.value.jadeBracelet = 1
            calculatorData.value.sandalwoodBracelet = 3
            calculatorData.value.goldEarrings = 5
            calculatorData.value.gemRing = 4
            calculatorData.value.loveLetter = 2
            calculatorData.value.forage = 10

            formulaSettings.value.intimacy.ordos = 2
            formulaSettings.value.intimacy.sandalwoodBracelet = 4
            formulaSettings.value.intimacy.forage = 2

            const wrapper = createWrapper()

            // ordos: Math.floor(4 * 2 * 2) = 16
            // takya: 6 * 2 = 12
            // jadeBracelet: 1 * 5 = 5
            // sandalwoodBracelet: Math.floor(3 * 4) = 12
            // goldEarrings: 5 * 2 = 10
            // gemRing: 4 * 1 = 4
            // loveLetter: 2 * 1 = 2
            // forage: Math.floor(10 * 2) = 20
            // Total: 16 + 12 + 5 + 12 + 10 + 4 + 2 + 20 = 81
            expect(wrapper.vm.total).toBe(81)
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

            const testId = 'ordos'
            const testValue = 15

            wrapper.vm.updateItem(testId, testValue)

            expect(wrapper.emitted('update-items')).toBeTruthy()
            expect(wrapper.emitted('update-items')[0]).toEqual([
                { ...calculatorData.value, [testId]: testValue }
            ])
        })

        it('should pass correct props to IntimacyItem components', () => {
            const wrapper = createWrapper()

            const firstIntimacyItem = wrapper.findAllComponents(IntimacyItem)[0]
            const expectedItem = intimacyItemsConfig[0]

            expect(firstIntimacyItem.props('item')).toEqual(expectedItem)
            expect(firstIntimacyItem.props('value')).toBe(calculatorData.value[expectedItem.id])
            expect(firstIntimacyItem.props('total')).toBe(wrapper.vm.totals[expectedItem.id])
        })
    })

    describe('Formula info display', () => {
        it('should display formula information', () => {
            const wrapper = createWrapper()
            const formulaInfo = wrapper.find('.formula-info')

            expect(formulaInfo.exists()).toBe(true)
            expect(formulaInfo.text()).toContain('Формулы расчета:')
            expect(formulaInfo.text()).toContain(`Ордос: количество × количество наложниц × ${formulaSettings.value.intimacy.ordos}`)
            expect(formulaInfo.text()).toContain(`Сандаловый браслет: количество × ${formulaSettings.value.intimacy.sandalwoodBracelet}`)
            expect(formulaInfo.text()).toContain(`Фураж: количество × ${formulaSettings.value.intimacy.forage}`)
        })

        it('should update formula info when settings change', async () => {
            const wrapper = createWrapper()

            formulaSettings.value.intimacy.ordos = 2.5
            formulaSettings.value.intimacy.sandalwoodBracelet = 4

            await wrapper.vm.$nextTick()

            const formulaInfo = wrapper.find('.formula-info')
            expect(formulaInfo.text()).toContain('Ордос: количество × количество наложниц × 2.5')
            expect(formulaInfo.text()).toContain('Сандаловый браслет: количество × 4')
        })
    })

    describe('Reactivity', () => {
        it('should recalculate totals when calculatorData changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            calculatorData.value.ordos = 10
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
            expect(wrapper.vm.totals.ordos).toBe(Math.floor(10 * calculatorData.value.concubines * formulaSettings.value.intimacy.ordos))
        })

        it('should recalculate totals when formulaSettings changes', async () => {
            const wrapper = createWrapper()
            const initialTotal = wrapper.vm.total

            formulaSettings.value.intimacy.ordos = 2
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.total).not.toBe(initialTotal)
            expect(wrapper.vm.totals.ordos).toBe(Math.floor(calculatorData.value.ordos * calculatorData.value.concubines * 2))
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
                ordos: 0,
                takya: 0,
                jadeBracelet: 0,
                sandalwoodBracelet: 0,
                goldEarrings: 0,
                gemRing: 0,
                loveLetter: 0,
                forage: 0
            }

            const wrapper = createWrapper()

            expect(wrapper.vm.total).toBe(0)
            Object.values(wrapper.vm.totals).forEach(total => {
                expect(total).toBe(0)
            })
        })

        it('should handle decimal values in formulas', () => {
            calculatorData.value.ordos = 3
            calculatorData.value.concubines = 2
            formulaSettings.value.intimacy.ordos = 1.7 // 3 * 2 * 1.7 = 10.2 -> Math.floor = 10

            const wrapper = createWrapper()

            expect(wrapper.vm.totals.ordos).toBe(10)
        })

        it('should handle large numbers', () => {
            calculatorData.value.concubines = 100
            calculatorData.value.ordos = 1000
            formulaSettings.value.intimacy.ordos = 3

            const wrapper = createWrapper()

            expect(wrapper.vm.totals.ordos).toBe(300000) // 1000 * 100 * 3
        })

        it('should handle items with same id (forage) appearing in both tabs', () => {
            // Проверяем что forage считается отдельно для близости
            calculatorData.value.forage = 15
            formulaSettings.value.intimacy.forage = 1.2

            const wrapper = createWrapper()

            expect(wrapper.vm.totals.forage).toBe(Math.floor(15 * 1.2))
        })
    })

    describe('Config validation', () => {
        it('should have all items from intimacyItemsConfig', () => {
            const wrapper = createWrapper()

            intimacyItemsConfig.forEach(item => {
                expect(calculatorData.value).toHaveProperty(item.id)
            })
        })

        it('should have all required formula settings', () => {
            const wrapper = createWrapper()

            expect(formulaSettings.value.intimacy).toHaveProperty('ordos')
            expect(formulaSettings.value.intimacy).toHaveProperty('sandalwoodBracelet')
            expect(formulaSettings.value.intimacy).toHaveProperty('forage')
        })
    })
})