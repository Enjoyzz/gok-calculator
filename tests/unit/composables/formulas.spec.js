import { useFormulas } from '@/composables/formulas'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('useFormulas', () => {
    // Сохраняем оригинальный localStorage
    const originalLocalStorage = { ...localStorage }

    beforeEach(() => {
        // Очищаем localStorage перед каждым тестом
        localStorage.clear()
        vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
        // Восстанавливаем оригинальный localStorage после тестов
        localStorage.clear()
        Object.keys(originalLocalStorage).forEach(key => {
            localStorage.setItem(key, originalLocalStorage[key])
        })
        vi.restoreAllMocks()
    })

    describe('initialization', () => {
        it('should return default formulas when no saved data', () => {
            const { formulas, defaultFormulas } = useFormulas()

            expect(formulas.value).toEqual(defaultFormulas)
            expect(formulas.value.charm.blueHadak).toBe(1.5)
            expect(formulas.value.intimacy.ordos).toBe(1.5)
        })

        it('should load valid formulas from localStorage', () => {
            const testFormulas = {
                charm: { blueHadak: 2.0, silverHairpin: 4, chests: 3, forage: 2 },
                intimacy: { ordos: 2.0, sandalwoodBracelet: 4, forage: 1.5 }
            }

            localStorage.setItem('formulaSettings', JSON.stringify(testFormulas))

            const { formulas } = useFormulas()

            expect(formulas.value).toEqual(testFormulas)
        })

        it('should use default formulas when localStorage has invalid structure', () => {
            const invalidData = {
                charm: { blueHadak: 'invalid' }, // не число
                intimacy: { missingField: true } // отсутствуют обязательные поля
            }

            localStorage.setItem('formulaSettings', JSON.stringify(invalidData))

            const { formulas, defaultFormulas } = useFormulas()

            expect(formulas.value).toEqual(defaultFormulas)
        })

        it('should use default formulas when localStorage has malformed JSON', () => {
            localStorage.setItem('formulaSettings', 'invalid json')

            const { formulas, defaultFormulas } = useFormulas()

            expect(formulas.value).toEqual(defaultFormulas)
        })

        it('should remove invalid data from localStorage', () => {
            localStorage.setItem('formulaSettings', 'invalid json')

            useFormulas()

            expect(localStorage.getItem('formulaSettings')).toBeNull()
        })
    })

    describe('saveFormulas', () => {
        it('should save formulas to localStorage', () => {
            const { saveFormulas, formulas } = useFormulas()

            const newFormulas = {
                charm: { blueHadak: 2.0, silverHairpin: 4, chests: 3, forage: 2 },
                intimacy: { ordos: 2.0, sandalwoodBracelet: 4, forage: 1.5 }
            }

            saveFormulas(newFormulas)

            expect(formulas.value).toEqual(newFormulas)

            const saved = JSON.parse(localStorage.getItem('formulaSettings'))
            expect(saved).toEqual(newFormulas)
        })
    })

    describe('resetFormulas', () => {
        it('should reset formulas to defaults and clear localStorage', () => {
            const { resetFormulas, formulas, defaultFormulas } = useFormulas()

            // Сначала сохраняем кастомные формулы
            const customFormulas = {
                charm: { blueHadak: 2.0, silverHairpin: 4, chests: 3, forage: 2 },
                intimacy: { ordos: 2.0, sandalwoodBracelet: 4, forage: 1.5 }
            }

            localStorage.setItem('formulaSettings', JSON.stringify(customFormulas))
            // Пересоздаем composable чтобы загрузить кастомные формулы
            const { formulas: newFormulas, resetFormulas: newReset } = useFormulas()

            expect(newFormulas.value).toEqual(customFormulas)

            // Сбрасываем
            newReset()

            expect(newFormulas.value).toEqual(defaultFormulas)
            expect(localStorage.getItem('formulaSettings')).toBeNull()
        })
    })
})