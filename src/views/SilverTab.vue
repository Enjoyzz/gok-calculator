<script setup>
import {computed, inject} from 'vue';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import {calculatorDataKey, formulaSettingsKey, SharedKeySymbol} from '@/data/keys.js';
import ShareButton from '@/components/ShareButton.vue';
import {silverItemsConfig} from "@/data/silverItemsConfig.js";
import SilverItem from "@/views/SilverItem.vue";

const {isSharedView} = inject(SharedKeySymbol);
const {calculatorData} = inject(calculatorDataKey);
const {formulaSettings} = inject(formulaSettingsKey);


const emit = defineEmits(['update-items', 'open-setting']);

const totals = computed(() => ({
  silver88K_8M: calculatorData.value.silver88K_8M * 4_000_000,

  silver10M: calculatorData.value.silver10M * 10_000_000,
  silver1M: calculatorData.value.silver1M * 1_000_000,
  silver100K: calculatorData.value.silver100K * 100_000,

  silver2h: calculatorData.value.silver2h * 120 * calculatorData.value.silver,
  silver1h: calculatorData.value.silver1h * 60 * calculatorData.value.silver,
  silver30m: calculatorData.value.silver30m * 30 * calculatorData.value.silver,
  silver15m: calculatorData.value.silver15m * 15 * calculatorData.value.silver,
  silver5m: calculatorData.value.silver5m * 5 * calculatorData.value.silver,

  medal: calculatorData.value.medal * 30 * calculatorData.value.silver,
  chest: calculatorData.value.chest * 60 * calculatorData.value.silver,
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
  <TabPanel value="silver">
    <table>
      <tbody>
      <SilverItem
          v-for="item in silverItemsConfig"
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
  </TabPanel>

  <ShareButton v-if="!isSharedView"></ShareButton>

</template>

<style scoped>

</style>