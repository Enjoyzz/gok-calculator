<script setup>
import {ref, watch} from 'vue'
import {useStorage} from '@/composables/storage.js'
import {useFormulas} from '@/composables/formulas.js'
import CalculatorTabs from '@/components/CalculatorTabs.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import SaveIndicator from '@/components/SaveIndicator.vue'
import logo from '@/assets/img/gok_logo.png'

const {savedData, saveToStorage} = useStorage()
const {formulas, updateFormulas, resetFormulas} = useFormulas()

const concubines = ref(1)
const charmItems = ref({
  blueHadak: 0,
  whiteHadak: 0,
  goldHairpin: 0,
  silverHairpin: 0,
  perfume: 0,
  chests: 0,
  forage: 0
})
const intimacyItems = ref({
  ordos: 0,
  takya: 0,
  jadeBracelet: 0,
  sandalwoodBracelet: 0,
  goldEarrings: 0,
  gemRing: 0,
  loveLetter: 0,
  forage: 0
})

const defaultData = savedData.value

const showSettings = ref(false)
const showSaveIndicator = ref(false)
const saveMessage = ref('')
const tempFormulas = ref({})

// init
concubines.value = defaultData.concubines || 1
Object.keys(charmItems.value).forEach(key => {
  if (defaultData[key] !== undefined) charmItems.value[key] = defaultData[key]
})
Object.keys(intimacyItems.value).forEach(key => {
  if (defaultData[key] !== undefined) intimacyItems.value[key] = defaultData[key]
})



const triggerSaveIndicator = (message = '✓ Данные сохранены') => {
  saveMessage.value = message;
  showSaveIndicator.value = true;
  setTimeout(() => {
    showSaveIndicator.value = false;
  }, 3000);
};


const updateCharmItems = (newItems) => {
  charmItems.value = {...charmItems.value, ...newItems}
}

const updateIntimacyItems = (newItems) => {
  intimacyItems.value = {...intimacyItems.value, ...newItems}
}

const openSettings = () => {
  tempFormulas.value = {...formulas.value}
  showSettings.value = true
}

const saveSettings = (newFormulas) => {
  updateFormulas(newFormulas)
  showSettings.value = false
  triggerSaveIndicator('Настройки сохранены!')
}

const closeSettings = () => {
  showSettings.value = false
}

const resetSettings = () => {
  resetFormulas()
  triggerSaveIndicator('Настройки сброшены!')
}

watch(() => charmItems.value.forage, (v) => {
  intimacyItems.value.forage = v;
});

watch(() => intimacyItems.value.forage, (v) => {
  charmItems.value.forage = v;
});

watch([concubines, charmItems, intimacyItems], () => {
  saveToStorage({
    concubines: concubines.value,
    ...charmItems.value,
    ...intimacyItems.value
  })
  triggerSaveIndicator()
}, {deep: true})

</script>

<template>
  <div class="container">
    <div class="gok_logo">
      <img :src="logo" alt="Game of Khans">
    </div>

    <h1>Калькулятор обаяния и близости</h1>

    <div class="py-3">Кол-во наложниц:
      <input type="number" v-model.number="concubines" min="1">
    </div>

    <CalculatorTabs
        :concubines="concubines"
        :charm-items="charmItems"
        :intimacy-items="intimacyItems"
        :formulas="formulas"
        @update-charm-items="updateCharmItems"
        @update-intimacy-items="updateIntimacyItems"
    />

    <div class="settings-buttons">
      <button @click="openSettings" class="btn-settings">Настройки формул</button>
      <button @click="resetSettings" class="btn-reset">Сбросить настройки</button>
    </div>

    <SettingsModal
        v-if="showSettings"
        :formulas="tempFormulas"
        @save="saveSettings"
        @close="closeSettings"
    />

    <SaveIndicator
        :visible="showSaveIndicator"
        :message="saveMessage"
    />
  </div>
</template>

<style scoped>
.btn-settings {
  padding: 7px 10px;
  background: #747a81;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
  margin-bottom: 15px;
}

.btn-settings:hover {
  background: #727d83;
}

.btn-reset {
  padding: 7px 10px;
  background: transparent;
  color: #333333;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
  margin-bottom: 15px;
}
</style>
