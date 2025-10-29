<script setup>
import {useCalculator} from '@/composables/calculator.js'
import {useSaveIndicator} from '@/composables/saveIndicator.js'
import SettingsModal from "@/components/SettingsModal.vue";
import SaveIndicator from "@/components/SaveIndicator.vue";
import CalculatorTabs from "@/views/CalculatorTabs.vue";
import {ref, watch} from "vue";

const {
  formulas,
  calculatorData,
  isLoading,
  error,
  isSharedView,
  saveCalculatorData,
  saveFormulas,
  resetFormulas,
  clearSharedMode,
} = useCalculator()

const {
  showSaveIndicator,
  saveMessage,
  triggerSaveIndicator
} = useSaveIndicator()


const handleUpdateCalculatorItems = async (newItems) => {
  const success = await saveCalculatorData(newItems)

  if (success) {
    triggerSaveIndicator()
  }
}


const handleSaveFormulas = async (newFormulas) => {
  const success = await saveFormulas(newFormulas)
  if (success) triggerSaveIndicator('✓ Настройки сохранены')
}

const handleResetSettings = async () => {
  const success = await resetFormulas()
  if (success) triggerSaveIndicator('✓ Настройки сброшены')
}

watch(
    () => calculatorData.value.concubines,
    async (newValue, oldValue) => {
      if (newValue !== oldValue) {
        const success = await saveCalculatorData({concubines: newValue})
        if (success && oldValue !== undefined) {
          triggerSaveIndicator()
        }
      }
    }
)

</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div class="gok_logo">
        <img src="/gok.png" alt="Game of Khans">
      </div>

      <h1>Калькулятор обаяния и близости</h1>

      <div class="py-3">Кол-во наложниц:
        <input type="number" v-model.number="calculatorData.concubines">
      </div>

      <CalculatorTabs
          :concubines="calculatorData.concubines"
          :items="calculatorData"
          :formulas="formulas"
          @update-calculator-items="handleUpdateCalculatorItems"
      />


      <SettingsModal
          :formulas="formulas"
          @save="handleSaveFormulas"
          @reset="handleResetSettings"
      />

      <SaveIndicator
          :visible="showSaveIndicator"
          :message="saveMessage"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
