import { mount } from '@vue/test-utils'
import ShareButton from './ShareButton.vue'
import { ShareService } from '@/services/ShareService'

// Mock provide
const mockProvide = {
    [Symbol()]: { isSharedView: false },
    [Symbol()]: { calculatorData: { value: { charm: 100 } } },
    [Symbol()]: { formulaSettings: { value: { multiplier: 2 } } },
    [Symbol()]: { value: 'charm' }
}

describe('ShareButton', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ShareButton, {
            global: {
                provide: mockProvide
            }
        })
    })

    it('should not render in shared view', () => {
        const sharedViewProvide = {
            ...mockProvide,
            [Symbol()]: { isSharedView: true }
        }

        const sharedWrapper = mount(ShareButton, {
            global: {
                provide: sharedViewProvide
            }
        })

        expect(sharedWrapper.find('.share-btn').exists()).toBe(false)
    })

    it('should open modal on button click', async () => {
        vi.spyOn(ShareService, 'generateShareLink').mockReturnValue('https://example.com/share')

        await wrapper.find('.share-btn').trigger('click')

        expect(wrapper.vm.showShareModal).toBe(true)
        expect(wrapper.vm.shareLink).toBe('https://example.com/share')
    })

    it('should copy link to clipboard', async () => {
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue()
            }
        })

        wrapper.vm.shareLink = 'https://example.com/share'
        await wrapper.vm.copyToClipboard()

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/share')
        expect(wrapper.vm.isCopied).toBe(true)
    })
})