import { ref, onMounted } from 'vue'
import { dataService } from '@/services/DataService.js'

export function useCalculator() {
    const formulaSettings = ref({})
    const calculatorData = ref({})
    const concubines = ref({})
    const isLoading = ref(true)
    const error = ref(null)

    const loadData = async () => {
        try {
            isLoading.value = true
            error.value = null
            const { calculatorData: calcData, formulas: formData } = await dataService.loadAllData()
            calculatorData.value = calcData
            formulaSettings.value = formData
        } catch (err) {
            error.value = 'Не удалось загрузить данные'
            console.error('Error in loadData:', err)
        } finally {
            isLoading.value = false
        }
    }

    const saveCalculatorData = async (newData) => {
        try {
            Object.assign(calculatorData.value, newData)
            const success = await dataService.saveCalculatorData(calculatorData.value)
            return success
        } catch (err) {
            console.error('Error in saveCalculatorData:', err)
            return false
        }
    }

    const saveFormulas = async (newFormulas) => {
        try {
            formulaSettings.value = newFormulas
            const success = await dataService.saveFormulas(newFormulas)
            return success
        } catch (err) {
            console.error('Error in saveFormulas:', err)
            return false
        }
    }

    const resetFormulas = async () => {
        try {
            await dataService.resetFormulas()
            await loadData() // Перезагружаем данные после сброса
            return true
        } catch (err) {
            console.error('Error in resetFormulas:', err)
            return false
        }
    }

    onMounted(() => {
        loadData()
    })

    return {
        formulaSettings,
        calculatorData,
        concubines,
        isLoading,
        error,
        isSharedView: dataService.isSharedView,
        loadData,
        saveCalculatorData,
        saveFormulas,
        resetFormulas,
        clearSharedMode: dataService.clearSharedMode
    }
}