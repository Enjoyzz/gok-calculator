import { useSaveIndicator } from './saveIndicator'
import { nextTick } from 'vue'

describe('useSaveIndicator', () => {
    let saveIndicator

    beforeEach(() => {
        vi.useFakeTimers()
        saveIndicator = useSaveIndicator()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should initialize with hidden state', () => {
        expect(saveIndicator.showSaveIndicator.value).toBe(false)
        expect(saveIndicator.saveMessage.value).toBe('')
    })

    it('should trigger save indicator with default message', () => {
        saveIndicator.triggerSaveIndicator()

        expect(saveIndicator.showSaveIndicator.value).toBe(true)
        expect(saveIndicator.saveMessage.value).toBe('✓ Данные сохранены')
    })

    it('should trigger save indicator with custom message', () => {
        const customMessage = '✓ Настройки сохранены'
        saveIndicator.triggerSaveIndicator(customMessage)

        expect(saveIndicator.showSaveIndicator.value).toBe(true)
        expect(saveIndicator.saveMessage.value).toBe(customMessage)
    })

    it('should hide indicator after timeout', async () => {
        saveIndicator.triggerSaveIndicator()

        expect(saveIndicator.showSaveIndicator.value).toBe(true)

        vi.advanceTimersByTime(3000)
        await nextTick()

        expect(saveIndicator.showSaveIndicator.value).toBe(false)
    })
})