import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ShareButton from '@/components/ShareButton.vue'
import { ShareService } from '@/services/ShareService.js'
import { SharedKeySymbol, calculatorDataKey, formulaSettingsKey, activeTabKey } from '@/data/keys.js'

// Мокаем ShareService
vi.mock('@/services/ShareService.js')

describe('ShareButton.vue', () => {
    let calculatorData
    let formulaSettings
    let activeTab
    let isSharedView

    beforeEach(() => {
        calculatorData = ref({ test: 'data' })
        formulaSettings = ref({ settings: 'test' })
        activeTab = ref('charm')
        isSharedView = ref(false)

        // Сбрасываем моки
        vi.clearAllMocks()
    })

    const createWrapper = () => {
        return mount(ShareButton, {
            global: {
                provide: {
                    [SharedKeySymbol]: { isSharedView },
                    [calculatorDataKey]: { calculatorData },
                    [formulaSettingsKey]: { formulaSettings },
                    [activeTabKey]: activeTab
                }
            }
        })
    }

    describe('Initialization', () => {
        it('should render share button', () => {
            const wrapper = createWrapper()
            expect(wrapper.find('.share-btn').exists()).toBe(true)
            expect(wrapper.text()).toContain('Поделиться')
        })
    })

    describe('Share functionality', () => {
        it('should open modal when clicked', async () => {
            ShareService.generateShareLink.mockReturnValue('http://test-share-link')
            const wrapper = createWrapper()

            await wrapper.find('.share-btn').trigger('click')

            expect(wrapper.find('.modal-overlay').exists()).toBe(true)
            expect(ShareService.generateShareLink).toHaveBeenCalledWith(
                calculatorData.value,
                formulaSettings.value,
                activeTab.value
            )
        })

        it('should generate share link with correct data', async () => {
            const testLink = 'http://test-share-link'
            ShareService.generateShareLink.mockReturnValue(testLink)
            const wrapper = createWrapper()

            await wrapper.find('.share-btn').trigger('click')

            const linkInput = wrapper.find('.link-input')
            expect(linkInput.element.value).toBe(testLink)
        })
    })

    describe('Copy functionality', () => {
        it('should copy link to clipboard', async () => {
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: vi.fn() },
                writable: true
            })

            const wrapper = createWrapper()
            await wrapper.find('.share-btn').trigger('click')
            await wrapper.find('.copy-btn').trigger('click')

            expect(navigator.clipboard.writeText).toHaveBeenCalled()
            expect(wrapper.text()).toContain('Скопировано!')
        })
    })

    describe('Modal actions', () => {
        it('should close modal when overlay clicked', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.share-btn').trigger('click')

            await wrapper.find('.modal-overlay').trigger('click')
            expect(wrapper.find('.modal-overlay').exists()).toBe(false)
        })

        it('should close modal when close button clicked', async () => {
            const wrapper = createWrapper()
            await wrapper.find('.share-btn').trigger('click')

            await wrapper.find('.close-btn').trigger('click')
            expect(wrapper.find('.modal-overlay').exists()).toBe(false)
        })
    })
})