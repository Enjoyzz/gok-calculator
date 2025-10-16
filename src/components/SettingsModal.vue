<template>
  <div id="settings-modal" @click.self="$emit('close')">
    <div id="settings-modal-content">
      <h2>Настройки формул</h2>

      <div id="settings-modal-section">
        <h3>Обаяние</h3>
        <div class="settings-row" v-for="setting in charmSettings" :key="setting.key">
          <span class="settings-label">{{ setting.label }}:</span>
          <input
              type="number"
              v-model.number="formulas.charm[setting.key]"
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
              v-model.number="formulas.intimacy[setting.key]"
              :step="setting.step"
              :min="setting.min"
              :max="setting.max"
              class="settings-input"
          >
        </div>
      </div>

      <div class="settings-buttons">
        <button @click="$emit('save')" class="settings-btn settings-btn-primary">Сохранить</button>
        <button @click="$emit('close')" class="settings-btn settings-btn-secondary">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SettingsModal',
  props: {
    formulas: Object
  },
  emits: ['save', 'close'],
  setup() {
    const charmSettings = ref([
      { key: 'blueHadak', label: 'Синий хадак (множитель)', step: 0.1, min: 1, max: 3 },
      { key: 'silverHairpin', label: 'Серебряная шпилька (множитель)', step: 0.1, min: 1, max: 5 },
      { key: 'chests', label: 'Сундуки (множитель)', step: 0.1, min: 1 },
      { key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 1 }
    ])

    const intimacySettings = ref([
      { key: 'ordos', label: 'Ордос (множитель)', step: 0.1, min: 1, max: 3 },
      { key: 'sandalwoodBracelet', label: 'Сандаловый браслет (множитель)', step: 0.1, min: 1, max: 5 },
      { key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 1 }
    ])

    return {
      charmSettings,
      intimacySettings
    }
  }
}
</script>