<script setup>
import {inject} from 'vue';
import CharmTab from './CharmTab.vue';
import IntimacyTab from './IntimacyTab.vue';
import {activeTabKey, calculatorDataKey} from '@/data/keys.js';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import {useCalculator} from '@/composables/calculator.js';
import SilverTab from "@/views/SilverTab.vue";
import MeatTab from "@/views/MeatTab.vue";
import SoldierTab from "@/views/SoldierTab.vue";

defineEmits(['update-calculator-items', 'open-setting']);

const activeTab = inject(activeTabKey);
const {calculatorData} = inject(calculatorDataKey);
const {isSharedView} = useCalculator();
</script>

<template>
  <div class="py-3" v-if="['charm', 'intimacy'].includes(activeTab)">Кол-во наложниц:
    <input type="number" v-model.number="calculatorData.concubines" min="1" :disabled="isSharedView">
  </div>

  <div class="py-3 d-flex" v-if="['silver', 'meat', 'soldiers'].includes(activeTab)">
    <div>


      <div class="container2">
        <input type="number"  @click="e => e.target.select()" v-model.number="calculatorData.silver" min="1" :disabled="isSharedView">
        <div style="display: flex; gap: 0; align-items: center">
          <div class="icon">
            <img src="@/assets/img/icon/1-2.png">
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
        <input type="number"  @click="e => e.target.select()" v-model.number="calculatorData.meat" min="1" :disabled="isSharedView">
        <div style="display: flex; gap: 0; align-items: center">
          <div class="icon">
            <img src="@/assets/img/icon/1-3.png">
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
        <input type="number"  @click="e => e.target.select()" v-model.number="calculatorData.soldiers" min="1" :disabled="isSharedView">
        <div style="display: flex; gap: 0; align-items: center">
          <div class="icon">
            <img src="@/assets/img/icon/1-4.png">
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
    />

    <IntimacyTab
        v-if="activeTab === 'intimacy'"
        @update-items="$emit('update-calculator-items', $event)"
        @open-setting="$emit('open-setting', $event)"
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
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
  gap: 1em;
  overflow-x: auto;
}

@media (max-width: 600px) {
  .d-flex {
    display: flex;
    gap: 1em;
    flex-direction: column;
  }
}

.container2 {
  display: flex;
  align-items: center;
  gap: 10px; /* Расстояние между иконкой и текстом */
  padding: 10px;
  flex-direction: column;
}

.container2 input {
  width: 100%;
}

.icon {
  width: 50px;
  height: 50px;
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
  margin-left: -8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 0 8px 8px 0;
  white-space: nowrap; /* Текст не переносится */
}
</style>