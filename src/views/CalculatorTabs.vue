<script setup>
import {inject} from 'vue';
import CharmTab from './CharmTab.vue';
import IntimacyTab from './IntimacyTab.vue';
import {activeTabKey, calculatorDataKey} from '@/data/keys.js';
import {useCalculator} from '@/composables/calculator.js';

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
    <div>Серебро:
      <input type="number" v-model.number="calculatorData.silver" min="1" :disabled="isSharedView">
    </div>
    <div>Мясо:
      <input type="number" v-model.number="calculatorData.meat" min="1" :disabled="isSharedView">
    </div>
    <div>Солдаты:
      <input type="number" v-model.number="calculatorData.soldiers" min="1" :disabled="isSharedView">
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
  </div>
</template>

<style scoped>
  .d-flex {
    display: flex;
    gap: 1em;
  }
</style>