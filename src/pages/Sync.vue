<script setup>
import { ref, computed } from 'vue'
import iMdiClose from '~icons/mdi/close'

const pad = n => String(n).padStart(2, '0')

const arrivalTimer = ref('20:00:00') // что показывает серверный таймер в момент прибытия

let nextId = 1
const newRally = () => ({ id: nextId++, name: '', travel: '' })
const rallies = ref([newRally(), newRally()])

const addRally = () => rallies.value.push(newRally())
const removeRally = id => {
  rallies.value = rallies.value.filter(r => r.id !== id)
}

// "ЧЧ:ММ[:СС]" -> сек
function parseTimer(s) {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(String(s ?? '').trim())
  return m ? +m[1] * 3600 + +m[2] * 60 + +(m[3] ?? 0) : null
}

// "5" -> 5 мин | "1:11", "1.11", "1,11" -> 1 мин 11 сек
function parseTravel(s) {
  const str = String(s ?? '').trim()
  if (!str) return null
  const parts = str.split(/[:.,]/)
  if (parts.length > 2 || parts.some(p => !/^\d+$/.test(p))) return null
  const [min, sec = 0] = parts.map(Number)
  return min * 60 + sec
}

const fmtTimer = sec =>
  `${Math.floor(sec / 3600)}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`

const fmtTravel = sec => `${Math.floor(sec / 60)}:${pad(sec % 60)}`

const arrival = computed(() => parseTimer(arrivalTimer.value))

const rows = computed(() => {
  if (arrival.value == null) return []

  const list = rallies.value
    .map((r, i) => {
      const travel = parseTravel(r.travel)
      if (!travel) return null
      return {
        id: r.id,
        name: r.name || `Сбор ${i + 1}`,
        travel,
        launch: arrival.value + travel, // таймер убывает: раньше = больше
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.launch - a.launch) // первым стартует самый долгий

  return list.map((row, i) => ({
    ...row,
    gap: i === 0 ? null : list[i - 1].launch - row.launch,
  }))
})
</script>

<template>
  <v-card variant="text">
    <v-card-text>
      <div class="text-title-large mb-3">Прибытие</div>
      <v-text-field
        v-model="arrivalTimer"
        label="Серверное время прибытия"
        placeholder="ч:мм:сс"
        variant="outlined"
        density="compact"
        hide-details
        :error="arrival == null"
      />

      <div class="text-title-large mt-6 mb-3">Сборы</div>
      <div
        v-for="(r, i) in rallies"
        :key="r.id"
        class="d-flex ga-2 mb-2 align-center"
      >
        <v-text-field
          v-model="r.name"
          :label="`Сбор ${i + 1}`"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-text-field
          v-model="r.travel"
          label="Время в пути"
          placeholder="мм:сс"
          variant="outlined"
          density="compact"
          hide-details
          :error="!!r.travel && parseTravel(r.travel) == null"
        />
        <v-btn
          :icon="iMdiClose"
          variant="text"
          size="small"
          aria-label="Удалить"
          :disabled="rallies.length === 1"
          @click="removeRally(r.id)"
        />
      </div>

      <v-btn variant="tonal" color="primary" class="mt-2" @click="addRally">
        Добавить сбор
      </v-btn>
    </v-card-text>

    <template v-if="rows.length">
      <v-divider />
      <v-card-text>
        <div class="text-title-large mb-3">Порядок запуска</div>

        <v-list class="bg-transparent pa-0">
          <v-list-item v-for="(row, i) in rows" :key="row.id" class="px-0 border-b">
            <template #prepend>
              <v-avatar size="28" color="primary" variant="tonal" class="mr-3">
                {{ i + 1 }}
              </v-avatar>
            </template>

            <div class="font-weight-medium">{{ row.name }}</div>
            <div class="text-body-medium text-medium-emphasis">
              В пути {{ fmtTravel(row.travel) }}
              <span v-if="row.gap != null">
                · через {{ fmtTravel(row.gap) }} после предыдущего
              </span>
            </div>

            <template #append>
              <div class="text-title-medium font-weight-bold">
                {{ fmtTimer(row.launch) }}
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </template>
  </v-card>
</template>
