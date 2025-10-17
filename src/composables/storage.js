import { ref } from 'vue'

const validateData = function (obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false
    }
    const values = Object.values(obj)
    return values.every(value => typeof value === 'number' && !isNaN(value))
}
const cleanData = (data) => {
    if (typeof data !== 'object' || data === null) {
        return {}
    }

    const cleaned = {}

    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'number' && !isNaN(value)) {
            cleaned[key] = value
        }
    })

    return cleaned
}

export function useStorage() {
    const storageKey = 'calculatorData'
    let initialData = {}
    try {
        const saved = localStorage.getItem(storageKey)
        if (saved && saved !== 'null') {
            const parsedData = JSON.parse(saved)

            if (validateData(parsedData)) {
                initialData = parsedData
            } else {
                console.warn('Invalid data in storage, returning cleaned data')
                initialData = cleanData(parsedData)
            }
        }
    } catch (e) {
        console.warn('Error parsing storage data:', e)
        // Очищаем некорректные данные
        localStorage.removeItem(storageKey)
    }

    const savedData = ref(initialData)

    const saveToStorage = (data) => {
        Object.assign(savedData.value, data)
        localStorage.setItem(storageKey, JSON.stringify(savedData.value))
    }

    const loadFromStorage = () => {
        try {
            const saved = localStorage.getItem(storageKey)
            return saved && saved !== 'null' ? JSON.parse(saved) : {}
        } catch (e) {
            console.warn('Error loading storage data:', e)
            localStorage.removeItem(storageKey)
            return {}
        }
    }

    return {
        savedData,
        saveToStorage,
        loadFromStorage
    }
}