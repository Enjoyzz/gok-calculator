<script setup>
import {defineProps, defineEmits, inject} from 'vue'
import {SharedKeySymbol} from "@/data/keys.js";

const { isSharedView } = inject(SharedKeySymbol)

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
    <td>{{ item.approximately === true ? '~ ' : ''}}{{ total }}</td>
  </tr>
</template>

<style scoped>

</style>