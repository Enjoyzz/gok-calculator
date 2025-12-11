<script setup>
import {defineProps, defineEmits, inject} from 'vue'
import {SharedKeySymbol, formulaSettingsKey} from "@/data/keys.js";

const { isSharedView } = inject(SharedKeySymbol)
const { formulaSettings } = inject(formulaSettingsKey)

defineProps({
  item: Object,
  value: Number,
  total: Number
})

defineEmits(['update'])
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
      <code v-if="item.approximately" style="text-wrap: nowrap; font-size: 1.5em; font-weight: bolder; color: #a9a9a9">&times;{{ formulaSettings.charm[item.id] }}</code>
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
    <td style="text-wrap: nowrap;">{{ item.approximately === true ? '~ ' : ''}}{{ total }}</td>
  </tr>
</template>

<style scoped>

</style>