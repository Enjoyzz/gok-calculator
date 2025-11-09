<script setup>
import {computed, inject} from 'vue'
import CharmItem from './CharmItem.vue'
import {charmItemsConfig} from './../data/charmItemsConfig.js'
import {SharedKeySymbol, calcValuesKey, calcSettingsKey} from "@/data/keys.js";
import ShareButton from "@/components/ShareButton.vue";
const { isSharedView } = inject(SharedKeySymbol)
const { calcValues } = inject(calcValuesKey)
const { calcSettings } = inject(calcSettingsKey)


const emit = defineEmits(['update-items'])

const totals = computed(() => ({
  blueHadak: Math.floor(calcValues.value.blueHadak * calcValues.value.concubines * calcSettings.value.charm.blueHadak),
  whiteHadak: calcValues.value.whiteHadak * calcValues.value.concubines,
  goldHairpin: calcValues.value.goldHairpin * 5,
  silverHairpin: Math.floor(calcValues.value.silverHairpin * calcSettings.value.charm.silverHairpin),
  perfume: calcValues.value.perfume,
  chests: Math.floor(calcValues.value.chests * calcSettings.value.charm.chests),
  forage: Math.floor(calcValues.value.forage * calcSettings.value.charm.forage)
}))

const total = computed(() =>
    Object.values(totals.value).reduce((sum, val) => sum + val, 0)
)

const updateItem = (id, value) => {
  emit('update-items', { ...calcValues.value, [id]: value })
}
</script>

<template>
  <div class="tab-content active">
    <table>
      <tbody>
      <CharmItem
          v-for="item in charmItemsConfig"
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
      <li>Синий хадак: количество × количество наложниц × {{ calcSettings.charm.blueHadak }}</li>
      <li>Белый хадак: количество × количество наложниц × 1</li>
      <li>Золотая шпилька: количество × 5</li>
      <li>Серебряная шпилька: количество × {{ calcSettings.charm.silverHairpin }}</li>
      <li>Сундуки: количество × {{ calcSettings.charm.chests }}</li>
      <li>Духи: количество × 1</li>
      <li>Фураж: количество × {{ calcSettings.charm.forage }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>