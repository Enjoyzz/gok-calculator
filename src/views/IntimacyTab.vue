<script setup>
import {computed, inject} from 'vue';
import IntimacyItem from './IntimacyItem.vue';
import {intimacyItemsConfig} from './../data/intimacyItemsConfig.js';
import {calculatorDataKey, formulaSettingsKey, SharedKeySymbol} from '@/data/keys.js';
import ShareButton from '@/components/ShareButton.vue';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import SettingsButtons from '@/components/SettingsButtons.vue';

const {isSharedView} = inject(SharedKeySymbol);
const {calculatorData} = inject(calculatorDataKey);
const {formulaSettings} = inject(formulaSettingsKey);

const emit = defineEmits(['update-items', 'open-setting', 'reset-settings']);

const totals = computed(() => ({
  ordos: Math.floor(
      calculatorData.value.ordos * calculatorData.value.concubines * formulaSettings.value.intimacy.ordos),
  takya: calculatorData.value.takya * calculatorData.value.concubines,
  jadeBracelet: calculatorData.value.jadeBracelet * 5,
  sandalwoodBracelet: Math.floor(
      calculatorData.value.sandalwoodBracelet * formulaSettings.value.intimacy.sandalwoodBracelet),
  goldEarrings: calculatorData.value.goldEarrings * 2,
  gemRing: calculatorData.value.gemRing,
  loveLetter: calculatorData.value.loveLetter,
  forage: Math.floor(calculatorData.value.forage * formulaSettings.value.intimacy.forage),
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
  <TabPanel value="intimacy">
    <table>
      <tbody>
      <IntimacyItem
          v-for="item in intimacyItemsConfig"
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

  <div class="formula-info">
    <p><strong>Формулы расчета:</strong></p>
    <ul>
      <li>Ордос: количество × количество наложниц × {{ formulaSettings.intimacy.ordos }}</li>
      <li>Такъя: количество × количество наложниц × 1</li>
      <li>Нефритовый браслет: количество × 5</li>
      <li>Сандаловый браслет: количество × {{ formulaSettings.intimacy.sandalwoodBracelet }}</li>
      <li>Золотые серьги: количество × 2</li>
      <li>Самоцветное кольцо: количество × 1</li>
      <li>Любовное письмо: количество × 1</li>
      <li>Фураж: количество × {{ formulaSettings.intimacy.forage }}</li>
    </ul>
  </div>

  <SettingsButtons v-if="!isSharedView" @open-settings-modal="$emit('open-setting', $event)"
                   @reset-settings="$emit('reset-settings', $event)"/>
</template>

<style scoped>

</style>