import {onMounted, ref} from 'vue'
import {dataService} from '@/services/DataService.js'

export function useCalculator() {
    const formulas = ref({})
    const calculatorData = ref({})
    const isLoading = ref(true)

    const loadData = async () => {
        try {
            isLoading.value = true
            const { calculatorData: calcData, formulas: formData } = await dataService.loadAllData()
            calculatorData.value = calcData
            formulas.value = formData
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            isLoading.value = false
        }
    }

    const saveCalculatorData = async (newData) => {
        if (!dataService.isSharedView) {
            Object.assign(calculatorData.value, newData)
            return await dataService.saveCalculatorData(calculatorData.value)
        }
        return false
    }

    const saveFormulas = async (newFormulas) => {
        if (!dataService.isSharedView) {
            formulas.value = newFormulas
            return await dataService.saveFormulas(newFormulas)
        }
        return false
    }

    const resetFormulas = () => {
        if (!dataService.isSharedView) {
            dataService.resetFormulas()
            // Перезагружаем данные
            loadData()
        }
    }

    onMounted(() => {
        loadData()
    })

    return {
        formulas,
        calculatorData,
        isLoading,
        isSharedView: dataService.isSharedView,
        loadData,
        saveCalculatorData,
        saveFormulas,
        resetFormulas,
        clearSharedMode: dataService.clearSharedMode
    }
}