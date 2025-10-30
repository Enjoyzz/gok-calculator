import { mount } from '@vue/test-utils'
import CharmTab from './CharmTab.vue'
import CharmItem from './CharmItem.vue'
import { charmItemsConfig } from '@/data/charmItemsConfig'

// Mock provide
const mockProvide = {
    [Symbol()]: { isSharedView: false },
    [Symbol()]: {
        calculatorData: {
            value: {
                blueHadak: 5,
                whiteHadak: 10,
                goldHairpin: 3,
                silverHairpin: 7,
                perfume: 2,
                chests: 4,
                forage: 8,
                concubines: 3
            }
        }
    },
    [Symbol()]: {
        formulaSettings: {
            value: {
                charm: {
                    blueHadak: 1.5,
                    silverHairpin: 3,
                    chests: 2.2,
                    forage: 1.5
                }
            }
        }
    }
}

describe('CharmTab', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(CharmTab, {
            global: {
                provide: mockProvide,
                stubs: {
                    ShareButton: true
                }
            }
        })
    })

    it('should render all charm items', () => {
        const items = wrapper.findAllComponents(CharmItem)

        expect(items).toHaveLength(charmItemsConfig.length)
    })

    it('should calculate totals correctly', () => {
        // blueHadak: 5 * 3 * 1.5 = 22.5 → 22 (Math.floor)
        // whiteHadak: 10 * 3 = 30
        // goldHairpin: 3 * 5 = 15
        // silverHairpin: 7 * 3 = 21
        // perfume: 2 = 2
        // chests: 4 * 2.2 = 8.8 → 8
        // forage: 8 * 1.5 = 12

        const expectedTotal = 22 + 30 + 15 + 21 + 2 + 8 + 12

        expect(wrapper.vm.total).toBe(expectedTotal)
    })

    it('should emit update-items when item updates', async () => {
        await wrapper.findComponent(CharmItem).vm.$emit('update', 'blueHadak', 10)

        expect(wrapper.emitted('update-items')).toBeTruthy()
        expect(wrapper.emitted('update-items')[0]).toEqual([
            {
                ...mockProvide[Symbol()].calculatorData.value,
                blueHadak: 10
            }
        ])
    })

    it('should show formulas information', () => {
        const formulaInfo = wrapper.find('.formula-info')

        expect(formulaInfo.text()).toContain('Формулы расчета')
        expect(formulaInfo.text()).toContain(`Синий хадак: количество × количество наложниц × ${mockProvide[Symbol()].formulaSettings.value.charm.blueHadak}`)
    })

    it('should not show ShareButton in shared view', () => {
        const sharedProvide = {
            ...mockProvide,
            [Symbol()]: { isSharedView: true }
        }

        const sharedWrapper = mount(CharmTab, {
            global: {
                provide: sharedProvide,
                stubs: {
                    ShareButton: true
                }
            }
        })

        expect(sharedWrapper.findComponent({ name: 'ShareButton' }).exists()).toBe(false)
    })
})