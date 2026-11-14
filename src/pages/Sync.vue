<script setup>
import { ref, computed } from 'vue'
import iMdiClose from '~icons/mdi/close'

const pad = n => String(n).padStart(2, '0')

const mode = ref('arrival') // 'arrival' | 'start'
const arrivalTimer = ref('20:00:00') // таймер в момент прибытия всех сборов
const startTimer = ref('20:10:00')   // таймер в момент старта первого сбора

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

// сборы с валидным временем в пути
const valid = computed(() =>
  rallies.value
    .map((r, i) => {
      const travel = parseTravel(r.travel)
      return travel ? { id: r.id, name: r.name || `Сбор ${i + 1}`, travel } : null
    })
    .filter(Boolean)
)

const maxTravel = computed(() => Math.max(0, ...valid.value.map(r => r.travel)))

// таймер в момент прибытия
const arrival = computed(() => {
  if (mode.value === 'arrival') return parseTimer(arrivalTimer.value)
  const start = parseTimer(startTimer.value)
  if (start == null || !valid.value.length) return null
  const a = start - maxTravel.value
  return a >= 0 ? a : null // таймер не может уйти в минус
})

const inputError = computed(() => {
  const raw = mode.value === 'arrival' ? parseTimer(arrivalTimer.value) : parseTimer(startTimer.value)
  if (raw == null) return true
  return mode.value === 'start' && valid.value.length > 0 && arrival.value == null
})

const rows = computed(() => {
  if (arrival.value == null) return []

  const list = valid.value
    .map(r => ({ ...r, launch: arrival.value + r.travel })) // таймер убывает: раньше = больше
    .sort((a, b) => b.launch - a.launch)

  return list.map((row, i) => ({
    ...row,
    gap: i === 0 ? null : list[i - 1].launch - row.launch,
  }))
})
</script>

<template>
  <v-card variant="text">
    <v-tabs v-model="mode" grow>
      <v-tab value="arrival">По прибытию</v-tab>
      <v-tab value="start">По старту первого</v-tab>
    </v-tabs>

    <v-card-text>
      <v-text-field
        v-if="mode === 'arrival'"
        v-model="arrivalTimer"
        label="Серверное время прибытия"
        placeholder="ч:мм:сс"
        variant="outlined"
        density="compact"
        hide-details
        :error="inputError"
      />
      <template v-else>
        <v-text-field
          v-model="startTimer"
          label="Серверное время старта первого сбора"
          placeholder="ч:мм:сс"
          variant="outlined"
          density="compact"
          :hide-details="!inputError"
          :error="inputError"
          :error-messages="
            parseTimer(startTimer) != null && valid.length && arrival == null
              ? 'Время старта меньше самого долгого пути'
              : ''
          "
        />
        <div v-if="arrival != null" class="text-body-medium text-medium-emphasis mt-2">
          Прибытие всех сборов: <b>{{ fmtTimer(arrival) }}</b>
        </div>
      </template>

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
