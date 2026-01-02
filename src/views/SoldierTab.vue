<script setup>
import {computed, inject} from 'vue';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import {calculatorDataKey, formulaSettingsKey, SharedKeySymbol} from '@/data/keys.js';
import ShareButton from '@/components/ShareButton.vue';
import {soldiersItemsConfig} from "@/data/soldiersItemsConfig.js";
import SoldierItem from "@/views/SoldierItem.vue";

const {isSharedView} = inject(SharedKeySymbol);
const {calculatorData} = inject(calculatorDataKey);
const {formulaSettings} = inject(formulaSettingsKey);


const emit = defineEmits(['update-items', 'open-setting']);

const totals = computed(() => ({
  soldiers10M: calculatorData.value.soldiers10M * 10_000_000,
  soldiers1M: calculatorData.value.soldiers1M * 1_000_000,
  soldiers100K: calculatorData.value.soldiers100K * 100_000,
  soldiers2h: calculatorData.value.soldiers2h * 120 * calculatorData.value.soldiers,
  soldiers1h: calculatorData.value.soldiers1h * 60 * calculatorData.value.soldiers,
  soldiers30m: calculatorData.value.soldiers30m * 30 * calculatorData.value.soldiers,
  soldiers15m: calculatorData.value.soldiers15m * 15 * calculatorData.value.soldiers,
  soldiers5m: calculatorData.value.soldiers5m * 5 * calculatorData.value.soldiers,
  medal: calculatorData.value.medal * 30 * calculatorData.value.soldiers,
  chest: calculatorData.value.chest * 60 * calculatorData.value.soldiers,
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
      <SoldierItem
          v-for="item in soldiersItemsConfig"
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
        <td style="text-wrap: nowrap; font-size: large">~ {{ totalFormatted }} <span
            style="color: #ccc; font-size: small"> / {{ total }}</span></td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>

  <ShareButton v-if="!isSharedView"></ShareButton>


</template>

<style scoped>

</style>