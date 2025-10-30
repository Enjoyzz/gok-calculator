import { mount } from '@vue/test-utils'
import CalculatorTabs from './CalculatorTabs.vue'
import CharmTab from './CharmTab.vue'
import IntimacyTab from './IntimacyTab.vue'

// Mock inject
const mockActiveTab = {
    value: 'charm'
}

describe('CalculatorTabs', () => {
    let wrapper

    const createWrapper = (activeTab = 'charm') => {
        mockActiveTab.value = activeTab

        return mount(CalculatorTabs, {
            global: {
                provide: {
                    [Symbol()]: mockActiveTab
                },
                stubs: {
                    CharmTab: true,
                    IntimacyTab: true
                }
            }
        })
    }

    it('should render charm tab by default', () => {
        wrapper = createWrapper('charm')

        expect(wrapper.find('.tab.active').text()).toBe('Обаяние')
        expect(wrapper.findComponent(CharmTab).exists()).toBe(true)
    })

    it('should switch to intimacy tab when clicked', async () => {
        wrapper = createWrapper('charm')

        await wrapper.findAll('.tab')[1].trigger('click')

        expect(mockActiveTab.value).toBe('intimacy')
    })

    it('should emit update-calculator-items event', async () => {
        wrapper = createWrapper()

        await wrapper.findComponent(CharmTab).vm.$emit('update-items', { charm: 100 })

        expect(wrapper.emitted('update-calculator-items')).toBeTruthy()
        expect(wrapper.emitted('update-calculator-items')[0]).toEqual([{ charm: 100 }])
    })

    it('should apply active class to correct tab', () => {
        wrapper = createWrapper('intimacy')

        const tabs = wrapper.findAll('.tab')

        expect(tabs[0].classes()).not.toContain('active')
        expect(tabs[1].classes()).toContain('active')
    })
})