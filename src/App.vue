<script setup>
import {useCalculator} from '@/composables/calculator.js'
import {useSaveIndicator} from '@/composables/saveIndicator.js'
import SettingsModal from "@/components/SettingsModal.vue";
import SaveIndicator from "@/components/SaveIndicator.vue";
import CalculatorTabs from "@/views/CalculatorTabs.vue";
import {SharedKeySymbol, formulaSettingsKey, calculatorDataKey, activeTabKey} from "@/data/keys.js"
import {onMounted, provide, ref, watch} from "vue";

const {
  formulaSettings,
  calculatorData,
  isLoading,
  error,
  isSharedView,
  saveCalculatorData,
  saveFormulas,
  resetFormulas,
  clearSharedMode,
  savedActiveTab
} = useCalculator()


const activeTab = ref(savedActiveTab)


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
  if (success) {
    triggerSaveIndicator('✓ Настройки сохранены')
  }
}

const handleResetSettings = async () => {
  const success = await resetFormulas()
  if (success) {
    triggerSaveIndicator('✓ Настройки сброшены')
  }
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



provide(SharedKeySymbol, {
  isSharedView,
  clearSharedMode
})

provide(calculatorDataKey, {calculatorData})
provide(formulaSettingsKey, {formulaSettings})
provide(activeTabKey, activeTab)

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


      <div v-if="isSharedView" class="readonly-banner">
        🔒 Просмотр чужих данных · <small>Ваши данные остались в сохранности.
        <a style="color: #252525FF" href="#" @click.prevent="clearSharedMode">Вернутся к себе</a> </small>
      </div>

      <div class="py-3">Кол-во наложниц:
        <input type="number" v-model.number="calculatorData.concubines" :disabled="isSharedView">
      </div>

      <CalculatorTabs
          :concubines="calculatorData.concubines"
          :items="calculatorData"
          :formulaSettings="formulaSettings"
          @update-calculator-items="handleUpdateCalculatorItems"
      />


      <SettingsModal
          :formulaSettings="formulaSettings"
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
.readonly-banner {
  background: #f8d978;
  color: #252525;
  padding: 12px 20px;
  text-align: center;
  font-weight: 600;
  border-radius: 8px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  font-size: 20px;
}
</style>
