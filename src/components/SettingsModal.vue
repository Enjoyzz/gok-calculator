<script setup>
import {ref} from 'vue'

const showSettings = ref(false)
let tempFormulas = ref({})

const props = defineProps({
  formulas: Object
})

const emit = defineEmits(['save', 'reset'])


const openSettings = () => {
  tempFormulas.value = JSON.parse(JSON.stringify(props.formulas))
  showSettings.value = true
}

const resetSettings = () => {
  if (confirm('Сбросить все настройки формул к значениям по умолчанию?')) {
    emit('reset')
  }
}

const saveSettings = () => {
  emit('save', tempFormulas.value)
  closeSettings()
}

const closeSettings = () => {
  showSettings.value = false
}

// watchEffect(() => {
//   if (showSettings) {
//     tempFormulas.value = JSON.parse(JSON.stringify(formulas.value))
//   }
// })


const charmSettings = ref([
  {key: 'blueHadak', label: 'Синий хадак (множитель)', step: 0.1, min: 1, max: 3},
  {key: 'silverHairpin', label: 'Серебряная шпилька (множитель)', step: 0.1, min: 1, max: 5},
  {key: 'chests', label: 'Сундуки (множитель)', step: 0.1, min: 1},
  {key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 1}
])

const intimacySettings = ref([
  {key: 'ordos', label: 'Ордос (множитель)', step: 0.1, min: 1, max: 3},
  {key: 'sandalwoodBracelet', label: 'Сандаловый браслет (множитель)', step: 0.1, min: 1, max: 5},
  {key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 1}
])
</script>

<template>
  <div class="settings-buttons">
    <button @click="openSettings" class="btn-settings">Настройки формул</button>
    <button @click="resetSettings" class="btn-reset">Сбросить настройки</button>
  </div>

  <div id="settings-modal" v-if="showSettings" @click.self="closeSettings">
    <div id="settings-modal-content">
      <h2>Настройки формул</h2>

      <div id="settings-modal-section">
        <h3>Обаяние</h3>
        <div class="settings-row" v-for="setting in charmSettings" :key="setting.key">
          <span class="settings-label">{{ setting.label }}:</span>
          <input
              type="number"
              v-model.number="tempFormulas.charm[setting.key]"
              :step="setting.step"
              :min="setting.min"
              :max="setting.max"
              class="settings-input"
          >
        </div>
      </div>

      <div id="settings-modal-section">
        <h3>Близость</h3>
        <div class="settings-row" v-for="setting in intimacySettings" :key="setting.key">
          <span class="settings-label">{{ setting.label }}:</span>
          <input
              type="number"
              v-model.number="tempFormulas.intimacy[setting.key]"
              :step="setting.step"
              :min="setting.min"
              :max="setting.max"
              class="settings-input"
          >
        </div>
      </div>

      <div class="settings-buttons">
        <button @click="saveSettings" class="settings-btn settings-btn-primary">Сохранить</button>
        <button @click="closeSettings" class="settings-btn settings-btn-secondary">Отмена</button>
      </div>
    </div>
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

#settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

#settings-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

#settings-modal-section {
  margin-bottom: 20px;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.settings-label {
  flex: 1;
  margin-right: 10px;
}

.settings-input {
  width: 80px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.settings-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.settings-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.settings-btn-primary {
  background-color: #007bff;
  color: white;
}

.settings-btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>