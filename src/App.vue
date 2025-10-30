<script setup>
import {useCalculator} from '@/composables/calculator.js'
import {useSaveIndicator} from '@/composables/saveIndicator.js'
import SettingsModal from "@/components/SettingsModal.vue";
import SaveIndicator from "@/components/SaveIndicator.vue";
import CalculatorTabs from "@/views/CalculatorTabs.vue";
import {activeTabKey, calculatorDataKey, formulaSettingsKey, SharedKeySymbol} from "@/data/keys.js"
import {provide, ref, watch} from "vue";

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


const handleUpdateCalculatorItems = (newItems) => {
  saveCalculatorData(newItems).then(result => {
    if (result === true) {
      triggerSaveIndicator()
    }
  })
}


const handleSaveFormulas = (newFormulas) => {
  saveFormulas(newFormulas).then(result => {
    if (result === true) {
      triggerSaveIndicator('✓ Настройки сохранены')
    }
  })
}

const handleResetSettings = () => {
  resetFormulas().then(result => {
    if (result === true) {
      triggerSaveIndicator('✓ Настройки сброшены')
    }
  })

}

watch(
    () => calculatorData.value.concubines,
    (newValue, oldValue) => {
      saveCalculatorData({concubines: newValue}).then(result => {
        if (result === true && oldValue !== undefined) {
          triggerSaveIndicator()
        }
      })
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
        <a href="#" @click.prevent="clearSharedMode">Вернутся к себе</a> </small>
      </div>

      <div class="py-3">Кол-во наложниц:
        <input type="number" v-model.number="calculatorData.concubines" min="1" :disabled="isSharedView">
      </div>

      <CalculatorTabs @update-calculator-items="handleUpdateCalculatorItems"/>


      <SettingsModal v-if="!isSharedView" @save="handleSaveFormulas" @reset="handleResetSettings"/>

      <SaveIndicator :visible="showSaveIndicator" :message="saveMessage"/>
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

.readonly-banner a {
  color: #252525;
  text-decoration: underline;
}

/* Добавьте минимальные стили для состояний */
.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #f44336;
}

</style>
