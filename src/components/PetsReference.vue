<script setup>
import { ref, computed } from 'vue'
import { pets, petTypeKeys } from '@/config/pets.js'
import { formatLargeNumber } from '@/utils/formatNumbers.js'

const FIELDS = ['parts', 'berries', 'points']

const type = ref(petTypeKeys[0])
const cumulative = ref(false)

const fmt = v => formatLargeNumber(v, { removeZero: true })

const rows = computed(() => {
  const t = pets[type.value]
  const acc = { parts: 0, berries: 0, points: 0 }
  const broken = { parts: false, berries: false, points: false } // после первого null накопление теряет смысл
  const approx = { parts: false, berries: false, points: false }

  return Object.entries(t.levels).map(([lvl, cost]) => {
    const level = Number(lvl)
    const row = {
      level,
      summon: level === t['min-level'],
      milestone: level % 10 === 0,
      cells: {},
    }

    for (const f of FIELDS) {
      const v = cost[f]
      const isApprox = cost.approxFields?.includes(f) ?? false

      if (!cumulative.value) {
        row.cells[f] = v == null ? '—' : (isApprox ? '~' : '') + fmt(v)
        continue
      }

      if (v == null) broken[f] = true
      if (broken[f]) {
        row.cells[f] = '—'
        continue
      }
      acc[f] += v
      approx[f] ||= isApprox
      row.cells[f] = (approx[f] ? '~' : '') + fmt(acc[f])
    }
    return row
  })
})
</script>

<template>
  <div>
    <v-chip-group v-model="type" mandatory column>
      <v-chip v-for="id in petTypeKeys" :key="id" :value="id" variant="text" filter>
        <img :src="pets[id].icon" :alt="pets[id].quality" width="56" />
      </v-chip>
    </v-chip-group>

    <v-switch
      v-model="cumulative"
      label="Накопительно (всего до этого уровня)"
      color="primary"
      density="compact"
      hide-details
      class="mb-3"
    />

    <v-table density="compact" fixed-header height="60vh">
      <thead>
      <tr>
        <th>Ур.</th>
        <th class="text-right">Осколки</th>
        <th class="text-right">Ягодки</th>
        <th class="text-right">Очки</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="row in rows"
        :key="row.level"
        :class="{ 'bg-surface-variant': row.milestone }"
      >
        <td>
          {{ row.level }}
          <span v-if="row.summon" class="text-caption text-medium-emphasis">призыв</span>
        </td>
        <td class="text-right">{{ row.cells.parts }}</td>
        <td class="text-right">{{ row.cells.berries }}</td>
        <td class="text-right">{{ row.cells.points }}</td>
      </tr>
      </tbody>
    </v-table>

    <div class="text-caption text-medium-emphasis mt-2">
      «~» — значение приблизительное, «—» — данных пока нет.
    </div>
  </div>
</template>
