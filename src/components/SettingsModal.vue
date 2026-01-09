<script setup>
import {computed, inject, ref, watch} from 'vue';
import {formulaSettingsKey} from '@/data/keys.js';

const showSettings = ref(false);
let tempFormulas = ref({});

const {formulaSettings} = inject(formulaSettingsKey);

const emit = defineEmits(['save', 'close-setting-modal']);

const props = defineProps({
  openSetting: String | null,
});

watch(() => props.openSetting, (newData) => {
  if (newData !== null) {
    openSettings();
  }
});

const validateField = (input) => {
  let isValid = input.checkValidity();
  if (!isValid) {
    input.reportValidity();
  }
  return isValid;
};

const validate = () => {
  const inputs = document.querySelectorAll('.settings-input');
  for (let input of inputs) {
    if (!validateField(input)) {
      return false;
    }
  }
  return true;
};

const openSettings = () => {
  tempFormulas.value = JSON.parse(JSON.stringify(formulaSettings.value));
  showSettings.value = true;
};



const saveSettings = () => {
  if (!validate()) return;

  emit('save', tempFormulas.value);
  closeSettings();
};

const closeSettings = () => {
  showSettings.value = false;
  emit('close-setting-modal');
};

const charmSettings = computed(() => {

  const baseCharmSettings = [
    {key: 'blueHadak', label: 'Синий хадак (множитель)', step: 0.1, min: 1, max: 3},
    {key: 'silverHairpin', label: 'Серебряная шпилька (множитель)', step: 0.1, min: 1, max: 5},
    {key: 'chests', label: 'Сундуки (множитель)', step: 0.1, min: 0, max: null},
    {key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 0, max: null},
  ];

  if (props.openSetting === null || props.openSetting === undefined) {
    return baseCharmSettings;
  }

  let result = props.openSetting?.split('.', 2);

  if (result[0] !== 'charm') {
    return null;
  }

  return baseCharmSettings.filter(function(i) {
    return i.key === result[1];
  });

});

const intimacySettings = computed(() => {
  const baseIntimacySettings = [
    {key: 'ordos', label: 'Ордос (множитель)', step: 0.1, min: 1, max: 3},
    {key: 'sandalwoodBracelet', label: 'Сандаловый браслет (множитель)', step: 0.1, min: 1, max: 5},
    {key: 'forage', label: 'Фураж (множитель)', step: 0.1, min: 0, max: null},
  ];
  if (props.openSetting === null || props.openSetting === undefined) {
    return baseIntimacySettings;
  }

  let result = props.openSetting.split('.', 2);

  if (result[0] !== 'intimacy') {
    return null;
  }

  return baseIntimacySettings.filter(function(i) {
    return i.key === result[1];
  });
});
</script>

<template>
  <div id="settings-modal" v-if="showSettings" @click.self="closeSettings">
    <div id="settings-modal-content">
      <h2>Настройки формул</h2>

      <div id="settings-modal-section" v-if="charmSettings">
        <h3>Обаяние</h3>
        <div class="settings-row" v-for="setting in charmSettings" :key="setting.key">
          <span class="settings-label">{{ setting.label }}:</span>
          <input
              type="number"
              v-model.number="tempFormulas.charm[setting.key]"
              :step="setting.step"
              :min="setting.min"
              :max="setting.max"
              required
              class="settings-input"
              @blur="validateField($event.target)"
          >
        </div>
      </div>

      <div id="settings-modal-section" v-if="intimacySettings">
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
              @blur="validateField($event.target)"
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