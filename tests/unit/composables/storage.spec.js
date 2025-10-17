import { useStorage } from '@/composables/storage'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('useStorage', () => {
    const originalLocalStorage = { ...localStorage }

    beforeEach(() => {
        localStorage.clear()
        vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
        localStorage.clear()
        Object.keys(originalLocalStorage).forEach(key => {
            localStorage.setItem(key, originalLocalStorage[key])
        })
        vi.restoreAllMocks()
    })

    describe('initialization', () => {
        it('should initialize with empty object when no saved data', () => {
            const { savedData } = useStorage()

            expect(savedData.value).toEqual({})
        })

        it('should load existing data from localStorage and clear non-number key-pair values', () => {
            const testData = {
                charm: 100,
                intimacy: 200,
                settings: { theme: 'dark' }
            }
            localStorage.setItem('calculatorData', JSON.stringify(testData))

            const { savedData } = useStorage()

            expect(savedData.value).toEqual({
                charm: 100,
                intimacy: 200
            })
        })

        it('should handle malformed JSON in localStorage', () => {
            localStorage.setItem('calculatorData', 'invalid json')

            const { savedData } = useStorage()

            expect(savedData.value).toEqual({})
            expect(console.warn).toHaveBeenCalledWith('Error parsing storage data:', expect.any(SyntaxError))
            expect(localStorage.getItem('calculatorData')).toBeNull()
        })

        it('should handle null values in localStorage', () => {
            localStorage.setItem('calculatorData', 'null')

            const { savedData } = useStorage()

            expect(savedData.value).toEqual({})
        })
    })

    describe('saveToStorage', () => {
        it('should save data to localStorage and update savedData', () => {
            const { savedData, saveToStorage } = useStorage()

            const newData = { charm: 150, intimacy: 250 }
            saveToStorage(newData)

            expect(savedData.value).toEqual(newData)

            const stored = JSON.parse(localStorage.getItem('calculatorData'))
            expect(stored).toEqual(newData)
        })

        it('should merge new data with existing savedData', () => {
            const initialData = { charm: 100, intimacy: 200 }
            localStorage.setItem('calculatorData', JSON.stringify(initialData))

            const { savedData, saveToStorage } = useStorage()

            // Проверяем, что начальные данные загрузились
            expect(savedData.value).toEqual(initialData)

            // Сохраняем новые данные (мерджим)
            const additionalData = { gold: 500, settings: { theme: 'light' } }
            saveToStorage(additionalData)

            // Ожидаем объединенные данные
            const expectedData = {
                ...initialData,
                ...additionalData
            }

            expect(savedData.value).toEqual(expectedData)

            const stored = JSON.parse(localStorage.getItem('calculatorData'))
            expect(stored).toEqual(expectedData)
        })

        it('should overwrite existing properties when merging', () => {
            const initialData = { charm: 100, intimacy: 200, gold: 300 }
            localStorage.setItem('calculatorData', JSON.stringify(initialData))

            const { savedData, saveToStorage } = useStorage()

            const updatedData = { charm: 999, gold: 777 } // обновляем существующие поля
            saveToStorage(updatedData)

            const expectedData = {
                charm: 999,    // обновлено
                intimacy: 200, // осталось прежним
                gold: 777      // обновлено
            }

            expect(savedData.value).toEqual(expectedData)
        })


    })

    describe('loadFromStorage', () => {
        it('should load data from localStorage', () => {
            const testData = { charm: 100, intimacy: 200 }
            localStorage.setItem('calculatorData', JSON.stringify(testData))

            const { loadFromStorage } = useStorage()
            const loadedData = loadFromStorage()

            expect(loadedData).toEqual(testData)
        })

        it('should return empty object when no data in localStorage', () => {
            const { loadFromStorage } = useStorage()
            const loadedData = loadFromStorage()

            expect(loadedData).toEqual({})
        })

        it('should handle malformed JSON in loadFromStorage', () => {
            localStorage.setItem('calculatorData', 'invalid json')

            const { loadFromStorage } = useStorage()
            const loadedData = loadFromStorage()

            expect(loadedData).toEqual({})
            expect(console.warn).toHaveBeenCalledWith('Error parsing storage data:', expect.any(SyntaxError))
            expect(localStorage.getItem('calculatorData')).toBeNull()
        })
    })

    describe('reactivity', () => {
        it('should update savedData reactively when using saveToStorage', () => {
            const { savedData, saveToStorage } = useStorage()

            // Изначально пустой
            expect(savedData.value).toEqual({})

            // Сохраняем данные
            const testData = { charm: 100 }
            saveToStorage(testData)

            // Проверяем реактивное обновление
            expect(savedData.value).toEqual(testData)
        })
    })
})