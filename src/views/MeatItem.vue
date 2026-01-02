<script setup>
import {inject} from 'vue'
import {formulaSettingsKey, SharedKeySymbol} from "@/data/keys.js";
import {formatLargeNumber} from "@/utils/formatNumbers.js";


const { isSharedView } = inject(SharedKeySymbol)
const { formulaSettings } = inject(formulaSettingsKey)

defineProps({
  item: Object,
  value: Number,
  total: Number
})

defineEmits(['update', 'open-setting'])
</script>

<template>
  <tr>
    <td class="icon">
      <div :class="'bg'" :style="{backgroundImage:  `url(${item.bgColor})`}">
        <img :src="item.icon" :alt="item.name">
      </div>
    </td>
    <td>
      {{ item.name }}<br>
      <small class="text-muted">{{ item.description }}</small>
    </td>
    <td>

    </td>
    <td class="input-cell">
      <input
          type="number"
          :value="value"
          @click="e => e.target.select()"
          @input="$emit('update', item.id, Math.max(0, parseInt($event.target.value) || 0))"
          min="0"
          :disabled="isSharedView"
      >
    </td>
    <td style="text-wrap: nowrap;">{{ item.approximately === true ? '~ ' : ''}}{{ formatLargeNumber(total, {decimals: 2, removeZero: true}) }}</td>
  </tr>
</template>

<style scoped>

</style>