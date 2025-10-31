import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSaveIndicator } from '@/composables/saveIndicator.js'

describe('saveIndicator.js', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('Initialization', () => {
        it('should initialize with default values', () => {
            const { showSaveIndicator, saveMessage, triggerSaveIndicator } = useSaveIndicator()

            expect(showSaveIndicator.value).toBe(false)
            expect(saveMessage.value).toBe('')
            expect(typeof triggerSaveIndicator).toBe('function')
        })
    })

    describe('Trigger functionality', () => {
        it('should show indicator with default message', () => {
            const { showSaveIndicator, saveMessage, triggerSaveIndicator } = useSaveIndicator()

            triggerSaveIndicator()

            expect(showSaveIndicator.value).toBe(true)
            expect(saveMessage.value).toBe('✓ Данные сохранены')
        })

        it('should show indicator with custom message', () => {
            const { showSaveIndicator, saveMessage, triggerSaveIndicator } = useSaveIndicator()

            triggerSaveIndicator('✓ Настройки сохранены')

            expect(showSaveIndicator.value).toBe(true)
            expect(saveMessage.value).toBe('✓ Настройки сохранены')
        })

        it('should hide indicator after 3 seconds', () => {
            const { showSaveIndicator, triggerSaveIndicator } = useSaveIndicator()

            triggerSaveIndicator()
            expect(showSaveIndicator.value).toBe(true)

            vi.advanceTimersByTime(3000)

            expect(showSaveIndicator.value).toBe(false)
        })
    })

    describe('Multiple triggers', () => {
        it('should reset timer on subsequent triggers', () => {
            const { showSaveIndicator, triggerSaveIndicator } = useSaveIndicator()

            triggerSaveIndicator()
            vi.advanceTimersByTime(2000)
            expect(showSaveIndicator.value).toBe(true) // Должен быть еще visible

            // Trigger again - должен сбросить таймер
            triggerSaveIndicator()
            vi.advanceTimersByTime(2000)
            expect(showSaveIndicator.value).toBe(true) // Все еще visible

            vi.advanceTimersByTime(1000)
            expect(showSaveIndicator.value).toBe(false) // Теперь hidden
        })

        it('should update message on subsequent triggers', () => {
            const { saveMessage, triggerSaveIndicator } = useSaveIndicator()

            triggerSaveIndicator('First message')
            expect(saveMessage.value).toBe('First message')

            triggerSaveIndicator('Second message')
            expect(saveMessage.value).toBe('Second message')
        })
    })
})