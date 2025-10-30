import {onMounted, ref} from 'vue'
import {dataService} from '@/services/DataService.js'
import {RepositoryFactory} from "@/repositories/RepositoryFactory.js";

export function useCalculator() {
    const formulaSettings = ref({})
    const calculatorData = ref({})
    const concubines = ref({})
    const isLoading = ref(true)
    const error = ref(null)
    const showInvalidShareModal = ref(false)

    const loadData = async () => {
        try {
            isLoading.value = true
            error.value = null
            const { calculatorData: data, formulaSettings: settings } = await dataService.loadAllData()
            calculatorData.value = data
            formulaSettings.value = settings
        } catch (err) {
            error.value = 'Не удалось загрузить данные'
            console.error('Error in loadData:', err)
        } finally {
            isLoading.value = false
        }
    }
    const handleInvalidShareData = (event) => {
        console.log('📢 Invalid share data event received')
        showInvalidShareModal.value = true
        dataService.setHasInvalidShareData(true)
    }

    const handleInvalidShareConfirm = () => {
        RepositoryFactory.clearSharedMode()
    }


    const saveCalculatorData = async (newData) => {
        try {
            Object.assign(calculatorData.value, newData)
            return await dataService.saveCalculatorData(calculatorData.value)
        } catch (err) {
            console.error('Error in saveCalculatorData:', err)
            return false
        }
    }

    const saveFormulas = async (newFormulas) => {
        try {
            formulaSettings.value = newFormulas
            return await dataService.saveFormulas(newFormulas)
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
        window.addEventListener('invalidShareData', handleInvalidShareData)
        loadData()

        return () => {
            window.removeEventListener('invalidShareData', handleInvalidShareData)
        }
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
        showInvalidShareModal,
        handleInvalidShareConfirm,
        savedActiveTab: dataService.savedActiveTab(),
        clearSharedMode: dataService.clearSharedMode
    }
}