<script setup>
import { useCalculator } from '@/composables/calculator.js'
import { useSaveIndicator } from '@/composables/saveIndicator.js'
import SettingsModal from "@/components/SettingsModal.vue";
import SaveIndicator from "@/components/SaveIndicator.vue";
import CalculatorTabs from "@/views/CalculatorTabs.vue";

const {
  formulas,
  calculatorData,
  isSharedView,
  saveCalculatorData,
  saveFormulas,
  resetFormulas,
  clearSharedMode
} = useCalculator()

const {
  showSaveIndicator,
  saveMessage,
  triggerSaveIndicator
} = useSaveIndicator()


const handleUpdateCharmItems = async (newItems) => {
  const success = await saveCalculatorData(newItems)
  if (success) triggerSaveIndicator()
}

const handleUpdateIntimacyItems = async (newItems) => {
  const success = await saveCalculatorData(newItems)
  if (success) triggerSaveIndicator()
}

const handleSaveFormulas = async (newFormulas) => {
  const success = await saveFormulas(newFormulas)
  if (success) triggerSaveIndicator('✓ Настройки сохранены')
}

const handleResetSettings = () => {
  resetFormulas()
  triggerSaveIndicator('✓ Настройки сброшены')
}


</script>

<template>
  <div class="container">
    <div class="gok_logo">
      <img src="/gok.png" alt="Game of Khans">
    </div>

    <h1>Калькулятор обаяния и близости</h1>

    <div class="py-3">Кол-во наложниц:
      <input type="number" v-model.number="concubines" min="1">
    </div>

    <CalculatorTabs
        :concubines="calculatorData.concubines"
        :items="calculatorData"
        :formulas="formulas"
        @update-charm-items="handleUpdateCharmItems"
        @update-intimacy-items="handleUpdateIntimacyItems"
    />


    <SettingsModal
        :formulas="formulas"
        @save="handleSaveFormulas"
        @reset="resetSettings"
    />

    <SaveIndicator
        :visible="showSaveIndicator"
        :message="saveMessage"
    />
  </div>
</template>

<style scoped>

</style>
