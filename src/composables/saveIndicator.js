import { ref } from 'vue'

export function useSaveIndicator() {
    const showSaveIndicator = ref(false)
    const saveMessage = ref('')

    let timeoutId = null

    const triggerSaveIndicator = (message = '✓ Данные сохранены') => {
        saveMessage.value = message
        showSaveIndicator.value = true

        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            showSaveIndicator.value = false
        }, 3000)
    }

    return {
        showSaveIndicator,
        saveMessage,
        triggerSaveIndicator
    }
}