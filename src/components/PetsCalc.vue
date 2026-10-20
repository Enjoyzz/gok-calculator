<script setup>
import { ref, computed } from 'vue'
import { usePets, petTotal, findMaxLevel } from '@/composable/usePets'
import { petTypes, petTypeKeys } from '@/config/petTypes'
import iMdiClose from '~icons/mdi/close'
import iMdiPencil from '~icons/mdi/pencil'
import iMdiPlus from '~icons/mdi/plus'
import iMdiDeleteOutline from '~icons/mdi/delete-outline'
import iMdiDotsV from '~icons/mdi/dots-vertical'
import iMdiCalc from '~icons/mdi/calculator'
import petSplash from '@/assets/pet/petking/spt_5503_503.png'

import { useGenerateBadge } from '@/composable/badges.js'
import { berriesIcon } from '@/config/gok-item-icon-set.js'
import { formatLargeNumber } from '@/utils/formatNumbers.js'

const { addPet, updatePet, removePet, clearPets, totals, petsWithCost } = usePets()

// --- форма ---
const addPetDialog = ref(false)
const editingId = ref(null)
const selectedType = ref(null)
const selectedAction = ref(null)
const currentLevel = ref(null)
const desiredLevel = ref(null)

const isEditing = computed(() => editingId.value !== null)
const currentPetType = computed(() => petTypes[selectedType.value] ?? null)
const minLevel = computed(() => currentPetType.value?.['min-level'] ?? 1)
const maxLevel = computed(() => currentPetType.value?.['max-level'])

function resetLevels() {
  currentLevel.value = null
  desiredLevel.value = null
}

function resetForm() {
  editingId.value = null
  selectedType.value = null
  selectedAction.value = null
  resetLevels()
}

function onTypeChange(type) {
  selectedType.value = type
  selectedAction.value = null
  resetLevels()
}

function onActionChange(action) {
  selectedAction.value = action
  if (action === 'summon') resetLevels()
}

function openCreate() {
  resetForm()
  addPetDialog.value = true
}

function openEdit(pet) {
  editingId.value = pet.id
  selectedType.value = pet.type
  selectedAction.value = pet.action
  currentLevel.value = pet.currentLevel
  desiredLevel.value = pet.desiredLevel
  addPetDialog.value = true
}

function closeDialog() {
  addPetDialog.value = false
  resetForm()
}

// --- превью и валидация ---
const previewPet = computed(() => {
  if (!selectedType.value || !selectedAction.value) return null
  return {
    type: selectedType.value,
    action: selectedAction.value,
    currentLevel: currentLevel.value,
    desiredLevel: desiredLevel.value,
  }
})

const previewTotal = computed(() => (previewPet.value ? petTotal(previewPet.value) : null))

const levelError = computed(() => {
  if (selectedAction.value !== 'level-up') return null
  const c = currentLevel.value
  const d = desiredLevel.value
  if (!Number.isInteger(c) || !Number.isInteger(d)) return null
  if (c < minLevel.value || d > maxLevel.value) {
    return `Допустимо ${minLevel.value}–${maxLevel.value}`
  }
  if (d <= c) return 'Желаемый уровень должен быть выше текущего'
  return null
})

const canConfirm = computed(() => {
  const t = previewTotal.value
  return !!t && !levelError.value && !t.incomplete && t.parts + t.berries + t.points > 0
})

function submit() {
  const payload = {
    type: selectedType.value,
    action: selectedAction.value,
    currentLevel: currentLevel.value,
    desiredLevel: desiredLevel.value,
  }
  if (isEditing.value) updatePet(editingId.value, payload)
  else addPet(payload)
  closeDialog()
}

// --- очистка ---
const confirmClearDialog = ref(false)

function doClearAll() {
  clearPets()
  confirmClearDialog.value = false
  if (addPetDialog.value) closeDialog()
}

// --- расчёт по осколкам ---
const budgetDialog = ref(false)
const budgetShards = ref(null)

const budgetMax = computed(() =>
  findMaxLevel(selectedType.value, currentLevel.value, budgetShards.value)
)

function openBudgetDialog() {
  budgetShards.value = null
  budgetDialog.value = true
}

function applyBudget() {
  if (budgetMax.value != null) desiredLevel.value = budgetMax.value
  budgetDialog.value = false
}

// --- отображение ---
const fieldLabels = { parts: 'осколки', berries: 'ягодки', points: 'очки' }
const unknownLabels = total =>
  (total?.unknownFields ?? []).map(f => fieldLabels[f]).filter(Boolean).join(', ')

const fmt = v => formatLargeNumber(v, { removeZero: true })

function isApprox(total, field) {
  return total?.approxFields?.includes(field) ?? false
}

// '?' — данных нет вообще, '≥' — известна только часть, '~' — приблизительно
function cell(total, field) {
  const unknown = total.unknownFields.includes(field)
  if (unknown && !total[field]) return '?'
  const mark = unknown ? '≥' : isApprox(total, field) ? '~' : ''
  return mark + fmt(total[field])
}

const berriesBadge = computed(() =>
  useGenerateBadge(
    totals.value.berries,
    isApprox(totals.value, 'berries') || totals.value.unknownFields.includes('berries'),
  )
)
</script>

<template>
  <v-card variant="text">
    <v-card-text v-if="petsWithCost.length" class="d-flex align-center justify-space-between">
      <v-btn color="primary" variant="tonal" :prepend-icon="iMdiPlus" @click="openCreate">
        Добавить боевого питомца
      </v-btn>

      <v-btn
        color="error"
        title="Очистить всё"
        aria-label="Очистить всё"
        variant="text"
        :prepend-icon="iMdiDeleteOutline"
        @click="confirmClearDialog = true"
      />
    </v-card-text>

    <v-table v-if="petsWithCost.length" density="compact" class="mt-4">
      <thead>
      <tr>
        <th>Качество питомца</th>
        <th>Действие</th>
        <th>Осколки</th>
        <th>Ягодки</th>
        <th>Очки</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="pet in petsWithCost" :key="pet.id">
        <td><img v-if="pet.icon" :src="pet.icon" :alt="pet.quality" width="72" /></td>
        <td>
          {{ pet.action === 'summon' ? 'призыв' : `ур. ${pet.currentLevel} → ${pet.desiredLevel}` }}
        </td>

        <td v-if="pet.total.incomplete" colspan="3" class="text-error">
          нет данных для ур. {{ pet.total.rows.find(r => r.missing)?.level }}
        </td>
        <template v-else>
          <td>{{ cell(pet.total, 'parts') }}</td>
          <td>{{ cell(pet.total, 'berries') }}</td>
          <td>{{ cell(pet.total, 'points') }}</td>
        </template>

        <td class="text-right">
          <v-menu location="end">
            <template #activator="{ props }">
              <v-btn v-bind="props" :icon="iMdiDotsV" size="small" variant="text" />
            </template>
            <v-list prepend-gap="5">
              <v-list-item :prepend-icon="iMdiPencil" @click="openEdit(pet)">Редактировать</v-list-item>
              <v-list-item :prepend-icon="iMdiClose" @click="removePet(pet.id)">Удалить</v-list-item>
            </v-list>
          </v-menu>
        </td>
      </tr>
      </tbody>
    </v-table>

    <v-sheet
      v-else
      class="d-flex flex-column align-center justify-center text-center"
      color="transparent"
      rounded
    >
      <GokIcon :src="petSplash" alt="" :size="164" class="mb-4" />

      <div class="text-headline-small mb-2">Пока не добавлено ни одного питомца</div>
      <div class="text-body-large text-medium-emphasis mb-6" style="max-width: 420px;">
        Добавьте боевого питомца, укажите качество и действие — мы посчитаем,
        сколько осколков, ягод и очков понадобится.
      </div>

      <v-btn color="primary" variant="tonal" :prepend-icon="iMdiPlus" @click="openCreate">
        Добавить первого питомца
      </v-btn>
    </v-sheet>

    <template v-if="petsWithCost.length">
      <v-divider />
      <v-card-text v-if="totals.unknownFields.length" class="text-caption text-warning mt-3">
        Внимание: часть значений неизвестна ({{ unknownLabels(totals) }}) — в итоге показана нижняя граница.
      </v-card-text>

      <v-card-text class="d-flex ga-4 align-center font-weight-bold">
        <span class="text-body-large">Итого очков:</span>
        <span class="text-headline-small">{{ cell(totals, 'points') }}</span>
      </v-card-text>

      <v-card-text v-if="totals.berries > 0" class="d-flex ga-4 mt-5 align-center font-weight-bold">
        <span class="text-body-large">Также необходимо:</span>
        <GokIcon :icon="berriesIcon" :size="72" :badge="berriesBadge" />
      </v-card-text>
    </template>
  </v-card>

  <!-- Добавление / редактирование -->
  <v-dialog v-model="addPetDialog" max-width="500px">
    <v-card>
      <v-card-title>{{ isEditing ? 'Редактировать питомца' : 'Новый питомец' }}</v-card-title>

      <v-card-text>
        <h2 class="text-title-large my-3">Выберите качество боевого питомца</h2>
        <v-chip-group
          column
          mandatory
          :model-value="selectedType"
          @update:model-value="onTypeChange"
        >
          <v-chip v-for="id in petTypeKeys" :key="id" variant="text" filter :value="id">
            <img :src="petTypes[id].icon" :alt="petTypes[id].quality" width="64" />
          </v-chip>
        </v-chip-group>

        <template v-if="selectedType">
          <h2 class="text-title-large my-3">Что будете делать с питомцем?</h2>
          <v-radio-group inline :model-value="selectedAction" @update:model-value="onActionChange">
            <v-radio label="Призыв" value="summon" />
            <v-radio label="Поднятие уровня" value="level-up" />
          </v-radio-group>
        </template>

        <template v-if="selectedAction === 'level-up'">
          <v-text-field
            v-model.number="currentLevel"
            type="number"
            :min="minLevel"
            :max="maxLevel"
            label="Текущий уровень"
            variant="outlined"
          />
          <v-text-field
            v-model.number="desiredLevel"
            type="number"
            :min="currentLevel ?? minLevel"
            :max="maxLevel"
            label="Желаемый уровень"
            variant="outlined"
            :error-messages="levelError"
          >
            <template #append-inner>
              <v-tooltip text="Рассчитать по осколкам">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :icon="iMdiCalc"
                    size="small"
                    variant="text"
                    :disabled="!Number.isInteger(currentLevel)"
                    @click="openBudgetDialog"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
        </template>

        <div v-if="previewTotal?.hasUnknown" class="mt-2 text-warning">
          Некоторые значения неизвестны — они не будут учтены в сумме: {{ unknownLabels(previewTotal) }}
        </div>
        <div v-if="previewTotal?.incomplete" class="mt-2 text-error">
          Нет данных для уровня {{ previewTotal.rows.find(r => r.missing)?.level }} — добавление невозможно
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDialog">Отмена</v-btn>
        <v-btn :disabled="!canConfirm" color="primary" variant="tonal" @click="submit">
          {{ isEditing ? 'Сохранить' : 'Добавить' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Очистка -->
  <v-dialog v-model="confirmClearDialog" max-width="420px">
    <v-card>
      <v-card-title>Очистить список?</v-card-title>
      <v-card-text>
        Будут удалены все добавленные питомцы ({{ petsWithCost.length }}). Действие нельзя отменить.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="confirmClearDialog = false">Отмена</v-btn>
        <v-btn color="error" variant="flat" @click="doClearAll">Очистить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Расчёт по осколкам -->
  <v-dialog v-model="budgetDialog" max-width="420px">
    <v-card>
      <v-card-title>Рассчитать по осколкам</v-card-title>

      <v-card-text>
        <v-text-field
          v-model.number="budgetShards"
          type="number"
          :min="0"
          label="Количество осколков"
          variant="outlined"
          autofocus
          @keyup.enter="applyBudget"
        />

        <div v-if="budgetShards != null && budgetShards !== ''" class="text-caption text-medium-emphasis">
          <template v-if="budgetMax">
            На {{ budgetShards }} осколков хватит до ур. {{ budgetMax }}
          </template>
          <template v-else>Не хватает даже на один уровень.</template>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="budgetDialog = false">Отмена</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          :disabled="!budgetMax"
          @click="applyBudget"
        >
          Применить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
