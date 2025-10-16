import { ref } from 'vue'

export function useStorage() {
    const storageKey = 'calculatorData'
    let initialData = {}
    try {
        const saved = localStorage.getItem(storageKey)
        if (saved && saved !== 'null') {
            initialData = JSON.parse(saved)
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