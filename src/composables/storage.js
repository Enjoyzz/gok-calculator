import { ref, watch } from 'vue'

export function useStorage() {
    const storageKey = 'calculatorData'
    const savedData = ref(JSON.parse(localStorage.getItem(storageKey)) || {})


    const saveToStorage = (data) => {
        Object.assign(savedData.value, data)
        localStorage.setItem(storageKey, JSON.stringify(savedData.value))
    }

    const loadFromStorage = () => {
        const saved = localStorage.getItem(storageKey)
        return saved ? JSON.parse(saved) : {}
    }

    return {
        savedData,
        saveToStorage,
        loadFromStorage
    }
}