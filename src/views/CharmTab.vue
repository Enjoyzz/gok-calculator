<script setup>
import {computed, inject} from 'vue'
import CharmItem from './CharmItem.vue'
import {charmItemsConfig} from './../data/charmItemsConfig.js'
import {SharedKeySymbol, calculatorDataKey, formulaSettingsKey} from "@/data/keys.js";
import ShareButton from "@/components/ShareButton.vue";
const { isSharedView } = inject(SharedKeySymbol)
const { calculatorData } = inject(calculatorDataKey)
const { formulaSettings } = inject(formulaSettingsKey)


const emit = defineEmits(['update-items'])

const totals = computed(() => ({
  blueHadak: Math.floor(calculatorData.value.blueHadak * calculatorData.value.concubines * formulaSettings.value.charm.blueHadak),
  whiteHadak: calculatorData.value.whiteHadak * calculatorData.value.concubines,
  goldHairpin: calculatorData.value.goldHairpin * 5,
  silverHairpin: Math.floor(calculatorData.value.silverHairpin * formulaSettings.value.charm.silverHairpin),
  perfume: calculatorData.value.perfume,
  chests: Math.floor(calculatorData.value.chests * formulaSettings.value.charm.chests),
  forage: Math.floor(calculatorData.value.forage * formulaSettings.value.charm.forage)
}))

const total = computed(() =>
    Object.values(totals.value).reduce((sum, val) => sum + val, 0)
)

const updateItem = (id, value) => {
  emit('update-items', { ...calculatorData.value, [id]: value })
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
          :value="calculatorData[item.id]"
          :total="totals[item.id]"
          @update="updateItem"
      />
      <tr class="total-row">
        <td>ИТОГ</td>
        <td></td>
        <td></td>
        <td style="text-wrap: nowrap; font-size: large">~ {{ total }}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>

  <ShareButton v-if="!isSharedView" ></ShareButton>

  <div class="formula-info">
    <p><strong>Формулы расчета:</strong></p>
    <ul>
      <li>Синий хадак: количество × количество наложниц × {{ formulaSettings.charm.blueHadak }}</li>
      <li>Белый хадак: количество × количество наложниц × 1</li>
      <li>Золотая шпилька: количество × 5</li>
      <li>Серебряная шпилька: количество × {{ formulaSettings.charm.silverHairpin }}</li>
      <li>Сундуки: количество × {{ formulaSettings.charm.chests }}</li>
      <li>Духи: количество × 1</li>
      <li>Фураж: количество × {{ formulaSettings.charm.forage }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>