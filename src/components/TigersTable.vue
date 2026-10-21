<script setup>
import { ref, computed } from 'vue'
import { TIGERS_START_LEVEL, tigersCosts } from '@/config/tigers'


const fmt = n => n.toLocaleString('ru-RU')

// статичные данные — считаем один раз
const items = (() => {
  let total = 0
  return tigersCosts.map((count, i) => {
    total += count
    return { level: TIGERS_START_LEVEL + i, count, total }
  })
})()

const byLevel = new Map(items.map(i => [i.level, i]))
const minLevel = items[0].level
const maxLevel = items.at(-1).level

const range = (a, b) => Array.from({ length: Math.max(b - a + 1, 0) }, (_, i) => a + i)

const from = ref(null)
const to = ref(null)

// from: [min .. (to - 1)], to: [(from + 1) .. max]
const fromItems = computed(() => range(minLevel, (to.value ?? maxLevel + 1) - 1))
const toItems = computed(() => range((from.value ?? minLevel) + 1, maxLevel))

const rangeCost = computed(() =>
  from.value != null && to.value != null
    ? byLevel.get(to.value).total - byLevel.get(from.value).total
    : null
)

const tableItems = items.slice(1) // 400 — служебная строка, в таблице не нужна

</script>


<template>
  <v-card variant="tonal"  class="pa-4 mb-4">
    <div class="text-title-medium mb-3">Сколько знаков нужно</div>
    <div class="d-flex ga-3">
      <v-select
        v-model="from"
        :items="fromItems"
        label="С уровня"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
      <v-select
        v-model="to"
        :items="toItems"
        label="До уровня"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
    </div>
    <div v-if="rangeCost != null" class="text-headline-small font-weight-bold mt-3">
      {{ fmt(rangeCost) }} знаков
    </div>
  </v-card>

  <v-table hover fixed-header height="60vh" density="compact" class="mb-12">
    <thead>
    <tr>
      <th>Уровень</th>
      <th class="text-right">Знаков для уровня</th>
      <th class="text-right">Всего</th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="item in tableItems"
      :key="item.level"
    >
      <td>{{ item.level }}</td>
      <td class="text-right font-weight-bold">{{ fmt(item.count) }}</td>
      <td class="text-right font-weight-medium">{{ fmt(item.total) }}</td>
    </tr>
    </tbody>
  </v-table>
</template>
