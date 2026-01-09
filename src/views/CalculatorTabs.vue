<script setup>
import {inject, ref} from 'vue';
import CharmTab from './CharmTab.vue';
import IntimacyTab from './IntimacyTab.vue';
import {activeTabKey, calculatorDataKey} from '@/data/keys.js';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import {useCalculator} from '@/composables/calculator.js';
import SilverTab from "@/views/SilverTab.vue";
import MeatTab from "@/views/MeatTab.vue";
import SoldierTab from "@/views/SoldierTab.vue";
import silverGenIcon from '@/assets/img/icon/1-2.png'
import meatGenIcon from '@/assets/img/icon/1-3.png'
import soldiersGenIcon from '@/assets/img/icon/1-4.png'

defineEmits(['update-calculator-items', 'open-setting', 'reset-setting']);

const activeTab = inject(activeTabKey);
const {calculatorData} = inject(calculatorDataKey);
const {isSharedView} = useCalculator();
const openingResourceGenerationSettingModal = ref(false)
const resourceSettingType = ref(null)

const icons = {
  silverGenIcon,
  meatGenIcon,
  soldiersGenIcon
}


const openResourceGenerationSettingModal = function (type) {
  openingResourceGenerationSettingModal.value = true
  resourceSettingType.value = type
}
</script>

<template>
  <div class="py-3" v-if="['charm', 'intimacy'].includes(activeTab)">Кол-во наложниц:
    <input type="number" v-model.number="calculatorData.concubines" min="1" :disabled="isSharedView">
  </div>

  <div class="py-3 d-flex" v-if="['silver', 'meat', 'soldiers'].includes(activeTab)">
    <div>


      <div class="container2">
        <div style="display: flex; gap: 0; align-items: center" @click="openResourceGenerationSettingModal('silver')">
          <div class="icon">
            <img :src="silverGenIcon">
          </div>
          <div class="text">{{
              formatLargeNumber(calculatorData.silver, {
                removeZero: true,
                currency: '/мин.',
                withCurrency: true
              })
            }}
          </div>
        </div>
      </div>

    </div>
    <div>

      <div class="container2">
        <div style="display: flex; gap: 0; align-items: center" @click="openResourceGenerationSettingModal('meat')">
          <div class="icon">
            <img :src="meatGenIcon">
          </div>
          <div class="text">{{
              formatLargeNumber(calculatorData.meat, {
                removeZero: true,
                currency: '/мин.',
                withCurrency: true
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <div>


      <div class="container2">
        <div style="display: flex; gap: 0; align-items: center" @click="openResourceGenerationSettingModal('soldiers')">
          <div class="icon">
            <img :src="soldiersGenIcon">
          </div>
          <div class="text">{{
              formatLargeNumber(calculatorData.soldiers, {
                removeZero: true,
                currency: '/мин.',
                withCurrency: true
              })
            }}
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="calculator">
    <div class="tabs">
      <div
          class="tab"
          :class="{ active: activeTab === 'charm' }"
          @click="activeTab = 'charm'"
      >
        Обаяние
      </div>
      <div
          class="tab"
          :class="{ active: activeTab === 'intimacy' }"
          @click="activeTab = 'intimacy'"
      >
        Близость
      </div>
      <div
          class="tab"
          :class="{ active: activeTab === 'silver' }"
          @click="activeTab = 'silver'"
      >
        Серебро
      </div>
      <div
          class="tab"
          :class="{ active: activeTab === 'meat' }"
          @click="activeTab = 'meat'"
      >
        Мясо
      </div>
      <div
          class="tab"
          :class="{ active: activeTab === 'soldiers' }"
          @click="activeTab = 'soldiers'"
      >
        Солдаты
      </div>
    </div>

    <CharmTab
        v-if="activeTab === 'charm'"
        @update-items="$emit('update-calculator-items', $event)"
        @open-setting="$emit('open-setting', $event)"
        @reset-settings="$emit('reset-setting', $event)"
    />

    <IntimacyTab
        v-if="activeTab === 'intimacy'"
        @update-items="$emit('update-calculator-items', $event)"
        @open-setting="$emit('open-setting', $event)"
        @reset-settings="$emit('reset-setting', $event)"
    />

    <SilverTab
        v-if="activeTab === 'silver'"
        @update-items="$emit('update-calculator-items', $event)"
        @open-setting="$emit('open-setting', $event)"
    />


    <MeatTab
        v-if="activeTab === 'meat'"
        @update-items="$emit('update-calculator-items', $event)"
        @open-setting="$emit('open-setting', $event)"
    />


    <SoldierTab
        v-if="activeTab === 'soldiers'"
        @update-items="$emit('update-calculator-items', $event)"
        @open-setting="$emit('open-setting', $event)"
    />

    <div id="resource-setting-modal" v-if="openingResourceGenerationSettingModal">
      <div id="modal-content">
         <div class="container2" style="flex-direction: column">
          <div style="display: flex; gap: 0; align-items: center">
            <div class="icon">
              <img :src="icons[`${resourceSettingType}GenIcon`]">
            </div>
            <div class="text">{{
                formatLargeNumber(calculatorData[resourceSettingType], {
                  removeZero: true,
                  currency: '/мин.',
                  withCurrency: true
                })
              }}
            </div>
          </div>
           <input type="number" style="width: 100%"
                  @click="e => e.target.select()"
                  @keyup.enter="openingResourceGenerationSettingModal = false"
                  v-model.number="calculatorData[resourceSettingType]" min="1"
                  :disabled="isSharedView">
        </div>

        <div class="settings-buttons">
          <button @click="openingResourceGenerationSettingModal = false" class="settings-btn settings-btn-primary">
            Сохранить
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
  gap: 1em;
  overflow-x: auto;
  margin-bottom: 10px;
}

@media (max-width: 600px) {
  .d-flex {
    display: flex;
    gap: 0em;
    flex-direction: row;
  }
}

.container2 {
  display: flex;
  align-items: center;
  gap: 10px; /* Расстояние между иконкой и текстом */
  padding: 0 5px;
}

.container2 input {
  width: 100%;
}

.icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;
  overflow: hidden; /* Обрезаем лишнее, если изображение больше блока */
}

.icon img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Изображение заполняет блок без искажений */
}

.text {
  margin-left: -5px;
  font-size: small;
  color: #333;
  padding: 3px;
  background-color: #f5f5f5;
  border-radius: 0 8px 8px 0;
  white-space: nowrap;
  cursor: pointer;
}

#resource-setting-modal {
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

#modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
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