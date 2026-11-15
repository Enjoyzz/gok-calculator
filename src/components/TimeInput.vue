<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  error: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const UNITS = ['ч', 'мин', 'с']
const parts = ref(['', '', ''])
const refs = []

const pad = s => String(s || 0).padStart(2, '0')
const bad = i => i > 0 && Number(parts.value[i]) > 59

function join(p) {
  if (p.every(x => x === '')) return ''
  if (p[1] > 59 || p[2] > 59) return '' // невалидно — расчёта нет
  return `${Number(p[0] || 0)}:${pad(p[1])}:${pad(p[2])}`
}

function fromString(s) {
  const m = /^(\d+):(\d{1,2}):(\d{1,2})$/.exec(s ?? '')
  return m ? [m[1], m[2], m[3]] : ['', '', '']
}

// внешнее изменение (кнопка «Сейчас»)
watch(
  () => props.modelValue,
  v => {
    if (v !== join(parts.value)) parts.value = fromString(v)
  },
  { immediate: true },
)

function onInput(i, v) {
  const d = String(v ?? '').replace(/\D/g, '').slice(0, 2)
  parts.value[i] = d
  emit('update:modelValue', join(parts.value))
  if (d.length === 2 && i < 2) refs[i + 1]?.focus()
}
</script>

<template>
  <div>
    <div v-if="label" class="text-caption text-medium-emphasis mb-1">{{ label }}</div>
    <div class="d-flex ga-2">
      <v-text-field
        v-for="(unit, i) in UNITS"
        :key="unit"
        :ref="el => (refs[i] = el)"
        :model-value="parts[i]"
        :suffix="unit"
        inputmode="numeric"
        autocomplete="off"
        placeholder="00"
        variant="outlined"
        density="compact"
        hide-details
        :error="error || bad(i)"
        @update:model-value="v => onInput(i, v)"
        @focus="$event.target.select()"
      />
    </div>
  </div>
</template>
