import {computed, onMounted, ref} from 'vue'
import {dataService} from '@/services/DataService.js'
import {RepositoryFactory} from "@/repositories/RepositoryFactory.js";

export function useCalculator() {

    const concubines = ref({})
    const isLoading = ref(true)
    const error = ref(null)
    const showInvalidShareModal = ref(false)
    const appState = ref({})

    const calculatorData = computed(() => appState.value.calcValues || {})
    const formulaSettings = computed(() => appState.value.setting || {})
    const activeTab = computed({
        get: () => appState.value.activeTab || 'charm',
        set: (value) => { appState.value.activeTab = value }
    })

    const loadAppState = async () => {
        try {
            isLoading.value = true
            error.value = null

            const state = await dataService.loadAppState()
            console.log('🔄 Loaded app state:', state) // Что здесь?
            appState.value = state
        } catch (err) {
            error.value = 'Не удалось загрузить данные'
            console.error('Error in loadData:', err)
        } finally {
            isLoading.value = false
        }
    }

    const saveAppState = async (state) => {
        try {
            return await dataService.saveAppState(state.value)
        } catch (err) {
            console.error('Error in saveAppState:', err)
            return false
        }
    }


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

    const resetSettings = async () => {
        try {
            await dataService.resetSettings()
            await loadAppState()
            return true
        } catch (err) {
            console.error('Error in resetSettings:', err)
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
        loadAppState()

        return () => {
            window.removeEventListener('invalidShareData', handleInvalidShareData)
        }
    })

    return {
        appState,
        calculatorData,
        formulaSettings,
        activeTab,
        concubines,
        isLoading,
        error,
        isSharedView: dataService.isSharedView,
        loadData,
        saveAppState,
        resetSettings,
        showInvalidShareModal,
        handleInvalidShareConfirm,
        clearSharedMode: dataService.clearSharedMode
    }
}