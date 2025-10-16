<script setup>
import { computed } from 'vue'
import CharmItem from './CharmItem.vue'
import {charmItemsConfig} from './../data/charmItemsConfig.js'

const props = defineProps({
  items: Object,
  formulas: Object,
  concubines: Number
})

const emit = defineEmits(['update-items'])

const totals = computed(() => ({
  blueHadak: Math.floor(props.items.blueHadak * props.concubines * props.formulas.blueHadak),
  whiteHadak: props.items.whiteHadak * props.concubines,
  goldHairpin: props.items.goldHairpin * 5,
  silverHairpin: Math.floor(props.items.silverHairpin * props.formulas.silverHairpin),
  perfume: props.items.perfume,
  chests: Math.floor(props.items.chests * props.formulas.chests),
  forage: Math.floor(props.items.forage * props.formulas.forage)
}))

const total = computed(() =>
    Object.values(totals.value).reduce((sum, val) => sum + val, 0)
)

const updateItem = (id, value) => {
  emit('update-items', { ...props.items, [id]: value })
}
</script>

<template>
  <div class="tab-content active">
    <table>
      <CharmItem
          v-for="item in charmItemsConfig"
          :key="item.id"
          :item="item"
          :value="items[item.id]"
          :total="totals[item.id]"
          @update="updateItem"
      />
      <tr class="total-row">
        <td>ИТОГ</td>
        <td></td>
        <td></td>
        <td>{{ total }}</td>
      </tr>
    </table>
  </div>

  <div class="formula-info">
    <p><strong>Формулы расчета:</strong></p>
    <ul>
      <li>Синий хадак: количество × количество наложниц × {{ props.formulas.blueHadak }}</li>
      <li>Белый хадак: количество × количество наложниц × 1</li>
      <li>Золотая шпилька: количество × 5</li>
      <li>Серебряная шпилька: количество × {{ props.formulas.silverHairpin }}</li>
      <li>Сундуки: количество × {{ props.formulas.chests }}</li>
      <li>Духи: количество × 1</li>
      <li>Фураж: количество × {{ props.formulas.forage }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>