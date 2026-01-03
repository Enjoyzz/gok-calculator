<script setup>
import {computed, inject} from 'vue';
import CharmItem from './CharmItem.vue';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import {calculatorDataKey, formulaSettingsKey, SharedKeySymbol} from '@/data/keys.js';
import ShareButton from '@/components/ShareButton.vue';
import MeatItem from "@/views/MeatItem.vue";
import {meatItemsConfig} from "@/data/meatItemsConfig.js";

const {isSharedView} = inject(SharedKeySymbol);
const {calculatorData} = inject(calculatorDataKey);
const {formulaSettings} = inject(formulaSettingsKey);


const emit = defineEmits(['update-items', 'open-setting']);

const totals = computed(() => ({
  meat10M: calculatorData.value.meat10M * 10_000_000,
  meat1M: calculatorData.value.meat1M * 1_000_000,
  meat100K: calculatorData.value.meat100K * 100_000,
  meat2h: calculatorData.value.meat2h * 120 * calculatorData.value.meat,
  meat1h: calculatorData.value.meat1h * 60 * calculatorData.value.meat,
  meat30m: calculatorData.value.meat30m * 30 * calculatorData.value.meat,
  meat15m: calculatorData.value.meat15m * 15 * calculatorData.value.meat,
  meat5m: calculatorData.value.meat5m * 5 * calculatorData.value.meat,
  medal: calculatorData.value.medal * 30 * calculatorData.value.meat,
  chest: calculatorData.value.chest * 60 * calculatorData.value.meat,
}));

const total = computed(() =>
    Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const totalFormatted = computed(() =>
    formatLargeNumber(total.value, {removeZero: true}),
);

const updateItem = (id, value) => {
  emit('update-items', {...calculatorData.value, [id]: value});
};
</script>

<template>
  <div class="tab-content active">
    <table>
      <tbody>
      <MeatItem
          v-for="item in meatItemsConfig"
          :key="item.id"
          :item="item"
          :value="calculatorData[item.id]"
          :total="totals[item.id]"
          @update="updateItem"
          @open-setting="$emit('open-setting', $event)"
      />
      <tr class="total-row">
        <td>ИТОГ</td>
        <td></td>
        <td></td>
        <td></td>
        <td style="text-wrap: nowrap; font-size: large; text-align: end">~ {{ totalFormatted }}
          <div style="color: #ccc; font-size: small"> {{ total }}</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <ShareButton v-if="!isSharedView"></ShareButton>

</template>

<style scoped>

</style>