<script setup>

const emit = defineEmits(['reset-settings', 'open-settings-modal']);

const resetSettings = () => {
  if (confirm('Сбросить все настройки формул к значениям по умолчанию?')) {
    emit('reset-settings');
  }
};

const openSettings = () => {
  emit('open-settings-modal');
};
</script>

<template>
  <div class="settings-buttons">
    <button @click="resetSettings" class="btn-reset">Сбросить настройки</button>
    <button @click="openSettings" class="btn-settings">Настройки формул</button>
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

.settings-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>