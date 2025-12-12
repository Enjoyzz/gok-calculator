import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import IntimacyItem from '@/views/IntimacyItem.vue'
import {formulaSettingsKey, SharedKeySymbol} from '@/data/keys.js'

describe('IntimacyItem.vue', () => {
    let isSharedView
    let mockItem
    let mockValue
    let mockTotal

    const formulaSettings = ref({
        intimacy: {
            ordos: 1.5,
            sandalwoodBracelet: 3,
            forage: 1.2
        },
        charm: {
            blueHadak: 1.5,
            silverHairpin: 3,
            chests: 2.2,
            forage: 1.5
        }
    })

    beforeEach(() => {
        isSharedView = ref(false)
        mockItem = {
            id: 'ordos',
            name: 'Ордос',
            description: 'Добавляет всем вашим наложницам по 1-3 ед. близости',
            icon: '/test-icon.png',
            bgColor: 'red',
            approximately: true
        }
        mockValue = 5
        mockTotal = 22
    })

    const createWrapper = (props = {}) => {
        return mount(IntimacyItem, {
            props: {
                item: mockItem,
                value: mockValue,
                total: mockTotal,
                ...props
            },
            global: {
                provide: {
                    [SharedKeySymbol]: { isSharedView },
                    [formulaSettingsKey]: { formulaSettings }
                }
            }
        })
    }

    describe('Initialization and rendering', () => {
        it('should initialize and render correctly', () => {
            const wrapper = createWrapper()
            expect(wrapper.exists()).toBe(true)
        })

        it('should render item icon with correct background', () => {
            const wrapper = createWrapper()
            const iconDiv = wrapper.find('.icon .bg')
            expect(iconDiv.attributes('style')).toContain(`background-image: url("${mockItem.bgColor}")`)
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
            expect(Number(input.element.value)).toBe(mockValue)
        })

        it('should render total with approximately symbol', () => {
            const wrapper = createWrapper()
            const totalCell = wrapper.findAll('td').at(4)
            expect(totalCell.text()).toBe(`~ ${mockTotal}`)
        })
    })

    describe('Input behavior', () => {
        it('should emit update event when input changes', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')
            await input.setValue(10)
            expect(wrapper.emitted('update')[0]).toEqual([mockItem.id, 10])
        })

        it('should handle negative values as zero', async () => {
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')
            await input.setValue(-5)
            expect(wrapper.emitted('update')[0]).toEqual([mockItem.id, 0])
        })
    })

    describe('Shared view mode', () => {
        it('should disable input in shared view', () => {
            isSharedView.value = true
            const wrapper = createWrapper()
            const input = wrapper.find('input[type="number"]')
            expect(input.attributes('disabled')).toBeDefined()
        })
    })

    describe('Different item types', () => {
        it('should render takya item correctly', () => {
            const wrapper = createWrapper({
                item: {
                    id: 'takya',
                    name: 'Такъя',
                    description: 'Добавляет всем наложницам 1 ед. близости',
                    icon: '/takya.png',
                    bgColor: 'orange',
                    approximately: false
                },
                value: 8,
                total: 24
            })
            expect(wrapper.find('img').attributes('alt')).toBe('Такъя')
        })
    })
})