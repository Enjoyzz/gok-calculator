<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import iMdiClose from '~icons/mdi/close'
import TimeInput from "@/components/TimeInput.vue";

const H = 3600
const MSK_OFFSET = 3 * H * 1000

const pad = n => String(n).padStart(2, '0')

// Серверный таймер (убывающий) по реальному времени.
// Пт 12:00 → Сб 20:00 и Сб 20:00 → Сб 22:00. Вне окна — null.
function serverTimerAt(ts) {
  const d = new Date(ts + MSK_OFFSET) // читаем через getUTC*, получается МСК
  const day = d.getUTCDay() // 5 = пт, 6 = сб
  const s = d.getUTCHours() * H + d.getUTCMinutes() * 60 + d.getUTCSeconds()

  if (day === 5 && s >= 12 * H) return 24 * H - s + 20 * H // до Сб 20:00
  if (day === 6 && s < 20 * H) return 20 * H - s
  if (day === 6 && s < 22 * H) return 22 * H - s // фаза 2
  return null
}

const fmtTimer = sec =>
  `${Math.floor(sec / H)}:${pad(Math.floor((sec % H) / 60))}:${pad(sec % 60)}`

const fmtTravel = sec => `${Math.floor(sec / 60)}:${pad(sec % 60)}`

// "ЧЧ:ММ[:СС]" -> сек
function parseTimer(s) {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(String(s ?? '').trim())
  return m ? +m[1] * H + +m[2] * 60 + +(m[3] ?? 0) : null
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

// --- реальное время ---
const now = ref(Date.now())
let timerId = null
onMounted(() => { timerId = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(timerId))

const currentTimer = computed(() => serverTimerAt(now.value)) // null вне окна

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const localDiffers = new Date().getTimezoneOffset() !== -180

const mskClock = ts => {
  const d = new Date(ts + MSK_OFFSET)
  return `${DAY_NAMES[d.getUTCDay()]} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}
const localClock = ts => {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// Реальное время события по значению серверного таймера.
// Таймер убывает: событие в будущем, если его значение меньше текущего.
function realInfo(timer) {
  if (currentTimer.value == null || timer == null) return null
  const delta = currentTimer.value - timer // сек до события, <0 — уже прошло
  const ts = Math.floor(now.value / 1000) * 1000 + delta * 1000
  return { ts, delta }
}

// --- ввод ---
const initial = serverTimerAt(Date.now())
const mode = ref('arrival') // 'arrival' | 'start'
const arrivalTimer = ref(initial != null ? fmtTimer(initial) : '20:00:00')
const startTimer = ref(initial != null ? fmtTimer(initial) : '20:10:00')

function fillNow() {
  if (currentTimer.value == null) return
  const v = fmtTimer(currentTimer.value)
  if (mode.value === 'arrival') arrivalTimer.value = v
  else startTimer.value = v
}

let nextId = 1
const newRally = () => ({ id: nextId++, name: '', travel: '' })
const rallies = ref([newRally(), newRally()])

const addRally = () => rallies.value.push(newRally())
const removeRally = id => {
  rallies.value = rallies.value.filter(r => r.id !== id)
}

// --- расчёт ---
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
  const raw = parseTimer(mode.value === 'arrival' ? arrivalTimer.value : startTimer.value)
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
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="text-body-medium text-medium-emphasis">
          <template v-if="currentTimer != null">
            Сейчас на сервере: <b>{{ fmtTimer(currentTimer) }}</b>
          </template>
          <template v-else>Сейчас вне игрового окна (Пт 12:00 – Сб 22:00 МСК)</template>
        </div>
        <v-btn
          size="small"
          variant="tonal"
          :disabled="currentTimer == null"
          @click="fillNow"
        >
          Сейчас
        </v-btn>
      </div>

      <TimeInput
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
        <TimeInput
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
        <div v-if="arrival != null && realInfo(arrival)" class="text-body-medium text-medium-emphasis mt-2">
          Прибытие в реальном времени: <b>{{ mskClock(realInfo(arrival).ts) }} МСК</b>
          <template v-if="localDiffers"> · {{ localClock(realInfo(arrival).ts) }} у вас</template>
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
          placeholder="м.сс"
          inputmode="decimal"
          variant="outlined"
          density="compact"
          hide-details
          clearable
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
              <div class="text-right">
                <div class="text-title-medium font-weight-bold">
                  {{ fmtTimer(row.launch) }}
                </div>
                <template v-if="realInfo(row.launch)">
                  <div class="text-caption text-medium-emphasis">
                    {{ mskClock(realInfo(row.launch).ts) }} МСК
                    <template v-if="localDiffers">
                      · {{ localClock(realInfo(row.launch).ts) }} у вас
                    </template>
                  </div>
                  <div
                    class="text-caption"
                    :class="realInfo(row.launch).delta > 0 ? 'text-primary' : 'text-error'"
                  >
                    <template v-if="realInfo(row.launch).delta > 0">
                      через {{ fmtTimer(realInfo(row.launch).delta) }}
                    </template>
                    <template v-else>прошло</template>
                  </div>
                </template>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </template>
  </v-card>
</template>
