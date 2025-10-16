<script setup>
import { computed } from 'vue'
import IntimacyItem from './IntimacyItem.vue'
import { intimacyItemsConfig } from './../data/intimacyItemsConfig.js'

const props = defineProps({
  items: Object,
  formulas: Object,
  concubines: Number
})

const emit = defineEmits(['update-items'])

const totals = computed(() => ({
  ordos: Math.floor(props.items.ordos * props.concubines * props.formulas.ordos),
  takya: props.items.takya * props.concubines,
  jadeBracelet: props.items.jadeBracelet * 5,
  sandalwoodBracelet: Math.floor(props.items.sandalwoodBracelet * props.formulas.sandalwoodBracelet),
  goldEarrings: props.items.goldEarrings * 2,
  gemRing: props.items.gemRing,
  loveLetter: props.items.loveLetter,
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
      <IntimacyItem
          v-for="item in intimacyItemsConfig"
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
</template>

<style scoped>

</style>