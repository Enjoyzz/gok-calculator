<script setup>
import {computed, inject} from 'vue'
import IntimacyItem from './IntimacyItem.vue'
import {intimacyItemsConfig} from './../data/intimacyItemsConfig.js'
import {calcValuesKey, calcSettingsKey, SharedKeySymbol} from "@/data/keys.js";
import ShareButton from "@/components/ShareButton.vue";

const { isSharedView } = inject(SharedKeySymbol)
const { calcValues } = inject(calcValuesKey)
const { calcSettings } = inject(calcSettingsKey)

const emit = defineEmits(['update-items'])

const totals = computed(() => ({
  ordos: Math.floor(calcValues.value.ordos * calcValues.value.concubines * calcSettings.value.intimacy.ordos),
  takya: calcValues.value.takya * calcValues.value.concubines,
  jadeBracelet: calcValues.value.jadeBracelet * 5,
  sandalwoodBracelet: Math.floor(calcValues.value.sandalwoodBracelet * calcSettings.value.intimacy.sandalwoodBracelet),
  goldEarrings: calcValues.value.goldEarrings * 2,
  gemRing: calcValues.value.gemRing,
  loveLetter: calcValues.value.loveLetter,
  forage: Math.floor(calcValues.value.forage * calcSettings.value.intimacy.forage)
}))

const total = computed(() =>
    Object.values(totals.value).reduce((sum, val) => sum + val, 0)
)

const updateItem = (id, value) => {
  emit('update-items', {...calcValues.value, [id]: value})
}
</script>

<template>
  <div class="tab-content active">
    <table>
      <tbody>
      <IntimacyItem
          v-for="item in intimacyItemsConfig"
          :key="item.id"
          :item="item"
          :value="calcValues[item.id]"
          :total="totals[item.id]"
          @update="updateItem"
      />
      <tr class="total-row">
        <td>ИТОГ</td>
        <td></td>
        <td></td>
        <td style="text-wrap: nowrap">~ {{ total }}</td>
      </tr>
      </tbody>
    </table>
  </div>

  <ShareButton v-if="!isSharedView" ></ShareButton>

  <div class="formula-info">
    <p><strong>Формулы расчета:</strong></p>
    <ul>
      <li>Ордос: количество × количество наложниц × {{ calcSettings.intimacy.ordos }}</li>
      <li>Такъя: количество × количество наложниц × 1</li>
      <li>Нефритовый браслет: количество × 5</li>
      <li>Сандаловый браслет: количество × {{ calcSettings.intimacy.sandalwoodBracelet }}</li>
      <li>Золотые серьги: количество × 2</li>
      <li>Самоцветное кольцо: количество × 1</li>
      <li>Любовное письмо: количество × 1</li>
      <li>Фураж: количество × {{ calcSettings.intimacy.forage }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>