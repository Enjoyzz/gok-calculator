<script setup>
import {useCalculator} from '@/composables/calculator.js';
import {useSaveIndicator} from '@/composables/saveIndicator.js';
import SettingsModal from '@/components/SettingsModal.vue';
import SaveIndicator from '@/components/SaveIndicator.vue';
import CalculatorTabs from '@/views/CalculatorTabs.vue';
import {activeTabKey, calculatorDataKey, formulaSettingsKey, SharedKeySymbol} from '@/data/keys.js';
import {provide, ref, watch} from 'vue';
import VersionInfo from '@/components/VersionInfo.vue';

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
  savedActiveTab,
  showInvalidShareModal,
  handleInvalidShareConfirm,
} = useCalculator();

const activeTab = ref(savedActiveTab);

const {
  showSaveIndicator,
  saveMessage,
  triggerSaveIndicator,
} = useSaveIndicator();

const handleUpdateCalculatorItems = (newItems) => {
  saveCalculatorData(newItems).then(result => {
    if (result === true) {
      triggerSaveIndicator();
    }
  });
};

const handleSaveFormulas = (newFormulas) => {
  saveFormulas(newFormulas).then(result => {
    if (result === true) {
      triggerSaveIndicator('✓ Настройки сохранены');
    }
  });
};

const handleResetSettings = () => {
  resetFormulas().then(result => {
    if (result === true) {
      triggerSaveIndicator('✓ Настройки сброшены');
    }
  });

};

const openSetting = ref(null);

const handleOpenSetting = (e) => {
  openSetting.value = e;
};

const closeOpenSetting = () => {
  openSetting.value = null;
};

watch(
    () => activeTab.value,
    (newValue) => {
      localStorage.setItem('activeTab', newValue);
    },
);

watch(
    () => calculatorData.value.concubines,
    (newValue, oldValue) => {
      saveCalculatorData({concubines: newValue}).then(result => {
        if (result === true && oldValue !== undefined) {
          triggerSaveIndicator();
        }
      });
    },
);

watch(
    () => calculatorData.value.meat,
    (newValue, oldValue) => {
      saveCalculatorData({meat: newValue}).then(result => {
        if (result === true && oldValue !== undefined) {
          triggerSaveIndicator();
        }
      });
    },
);

watch(
    () => calculatorData.value.soldiers,
    (newValue, oldValue) => {
      saveCalculatorData({soldiers: newValue}).then(result => {
        if (result === true && oldValue !== undefined) {
          triggerSaveIndicator();
        }
      });
    },
);

watch(
    () => calculatorData.value.silver,
    (newValue, oldValue) => {
      saveCalculatorData({silver: newValue}).then(result => {
        if (result === true && oldValue !== undefined) {
          triggerSaveIndicator();
        }
      });
    },
);

provide(SharedKeySymbol, {
  isSharedView,
  clearSharedMode,
});

provide(calculatorDataKey, {calculatorData});
provide(formulaSettingsKey, {formulaSettings});
provide(activeTabKey, activeTab);

</script>

<template>

  <div v-if="showInvalidShareModal" class="modal-overlay" @click="handleInvalidShareConfirm">
    <div class="modal-content" @click.stop>
      <h3>Некорректная ссылка</h3>
      <p>Ссылка содержит некорректные данные.</p>
      <p>Вы будете перенаправлены на ваши данные.</p>
      <button @click="handleInvalidShareConfirm" class="confirm-btn">
        Понятно
      </button>
    </div>
  </div>
  <div v-else class="container">
    <VersionInfo
        style="float: right"
        :hideInDev="false"
        prefix="v"
        :showBuildTime="false"
        :showGitShaShort="true"
    />
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div class="gok_logo">
        <img src="/gok.png" alt="Game of Khans">
      </div>

      <h1>Калькулятор ресурсов

      </h1>



      <div v-if="isSharedView" class="readonly-banner">
        🔒 Просмотр чужих данных · <small>Ваши данные остались в сохранности.
        <a href="#" @click.prevent="clearSharedMode">Вернутся к себе</a> </small>
      </div>

      <CalculatorTabs
          @update-calculator-items="handleUpdateCalculatorItems"
          @open-setting="handleOpenSetting"
          @reset-setting="handleResetSettings"
      />
      <SettingsModal v-if="!isSharedView"
                     @save="handleSaveFormulas"
                     :openSetting="openSetting"
                     @close-setting-modal="closeOpenSetting"
      />
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


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.confirm-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}
</style>
