<script setup>
import { ref, computed, watch } from 'vue'
import { usePets } from '@/composable/usePets'
import { petTypes, petTypeKeys } from '@/config/petTypes'
import iMdiClose from '~icons/mdi/close'
import iMdiPencil from '~icons/mdi/pencil'
import iMdiPlus from '~icons/mdi/plus'
import iMdiInformationOutline from '~icons/mdi/information-outline'
import iMdiDotsV from '~icons/mdi/dots-vertical'
import petSplash from '@/assets/pet/petking/spt_5503_503.png'


import appleIconSrc from '@/assets/pet/spt_506_6606.png';

import {useGenerateBadge} from '@/composable/badges.js';
import {berriesIcon} from "@/config/gok-item-icon-set.js";
import {formatLargeNumber} from "@/utils/formatNumbers.js";

const addPetDialog = ref(false)
const editingId = ref(null) // null = создание, иначе id редактируемой записи

const selectedType = ref(null)
const selectedAction = ref(null)
const currentLevel = ref(null)
const desiredLevel = ref(null)

// При смене типа — сбрасываем зависимые поля (но не при открытии на редактирование)
const initializing = ref(false)

const {
  addPet, updatePet, removePet,
  totals, petsWithCost, breakdown, petTotal,
} = usePets(petTypes)

const currentPetType = computed(() => petTypes[selectedType.value] ?? null)
const minLevel = computed(() => currentPetType.value?.['min-level'] ?? 1)
const maxLevel = computed(() => currentPetType.value?.['max-level'])

const previewPet = computed(() => {
  if (!selectedType.value || !selectedAction.value) return null
  return {
    type: selectedType.value,
    action: selectedAction.value,
    currentLevel: currentLevel.value,
    desiredLevel: desiredLevel.value,
  }
})

const previewTotal = computed(() =>
  previewPet.value ? petTotal(previewPet.value) : null
)

const canConfirm = computed(() =>
  previewTotal.value && !previewTotal.value.incomplete
)

const isEditing = computed(() => editingId.value !== null)

// --- открытие диалога ---

function openCreate() {
  editingId.value = null
  selectedType.value = null
  selectedAction.value = null
  currentLevel.value = null
  desiredLevel.value = null
  addPetDialog.value = true
}

async function openEdit(pet) {
  initializing.value = true

  editingId.value = pet.id
  selectedType.value = pet.type
  selectedAction.value = pet.action
  currentLevel.value = pet.currentLevel
  desiredLevel.value = pet.desiredLevel
  addPetDialog.value = true

  await nextTick()
  initializing.value = false
}

function confirm() {
  const payload = {
    type: selectedType.value,
    action: selectedAction.value,
    currentLevel: currentLevel.value,
    desiredLevel: desiredLevel.value,
  }
  if (isEditing.value) {
    updatePet(editingId.value, payload)
  } else {
    addPet(payload)
  }
  closeDialog()
}

function closeDialog() {
  addPetDialog.value = false
  editingId.value = null
  selectedType.value = null
  selectedAction.value = null
  currentLevel.value = null
  desiredLevel.value = null
}

watch(selectedType, () => {
  if (initializing.value) return
  selectedAction.value = null
  currentLevel.value = null
  desiredLevel.value = null
})

watch(selectedAction, (action) => {
  if (initializing.value) return
  if (action === 'summon') {
    currentLevel.value = null
    desiredLevel.value = null
  }
})
</script>

<template>
  <v-card variant="text">
    <v-card-text v-if="petsWithCost.length">
      <v-btn color="primary" variant="tonal" @click="openCreate" :prepend-icon="iMdiPlus">Добавить боевого питомца</v-btn>
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
        <td><img v-if="pet.icon" :src="pet.icon" :alt="pet.quality " width="72" /></td>
        <td>
          {{ pet.action === 'summon'
          ? 'призыв'
          : `ур. ${pet.currentLevel} → ${pet.desiredLevel}` }}
        </td>

        <!-- Стоимость -->
        <template v-if="pet.total.incomplete">
          <td colspan="3" class="text-error">
            нет данных для ур. {{ pet.total.rows.find(r => r.missing)?.level }}
          </td>
        </template>
        <template v-else>
          <td>{{ pet.total.parts }}</td>
          <td>
            {{ pet.total.berries }}
          </td>
          <td>{{ formatLargeNumber( pet.total.points, {removeZero: true}) }}</td>
        </template>

        <!-- Действия -->
        <td class="text-right">
          <v-menu location="end">
            <template #activator="{ props }">
              <v-btn v-bind="props" :icon="iMdiDotsV" size="small" variant="text" />
            </template>
            <v-list prepend-gap="5">
              <v-list-item :prepend-icon="iMdiPencil" size="small" variant="text" @click="openEdit(pet)">Редактировать</v-list-item>
              <v-list-item :prepend-icon="iMdiClose" size="small" variant="text" @click="removePet(pet.id)">Удалить</v-list-item>
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

      <div class="text-h6 mb-2">Пока не добавлено ни одного питомца</div>
      <div class="text-body-2 text-medium-emphasis mb-6" style="max-width: 420px;">
        Добавьте боевого питомца, укажите качество и действие — мы посчитаем,
        сколько осколков, ягод и очков понадобится.
      </div>

      <v-btn color="primary" variant="tonal" :prepend-icon="iMdiPlus" @click="openCreate">
        Добавить первого питомца
      </v-btn>
    </v-sheet>

    <template v-if="petsWithCost.length">
      <v-divider />
      <v-card-text class="d-flex ga-4 mt-5 align-center font-weight-bold">
        <span class="text-body-large">Итого очков:</span>
        <span class="text-headline-small">{{ formatLargeNumber(totals.points, { removeZero: true }) }}</span>
      </v-card-text>

      <v-card-text v-if="totals.berries > 0" class="d-flex ga-4 mt-5 align-center font-weight-bold">
        <span class="text-body-large">Также необходимо:</span>
        <GokIcon :icon="berriesIcon" :size="72" :badge="useGenerateBadge(totals.berries)" />
      </v-card-text>
    </template>
  </v-card>

  <v-dialog v-model="addPetDialog" max-width="500px">
    <v-card>
      <v-card-title>
        {{ isEditing ? 'Редактировать питомца' : 'Новый питомец' }}
      </v-card-title>

      <v-card-text>
        <h2 class="text-title-large my-3">Выберите качество боевого питомца</h2>
        <v-chip-group column inline v-model="selectedType" label="Выберите качество боевого питомца">
          <v-chip
            v-for="id in petTypeKeys"
            :key="id"
            variant="text"
            filter
            :value="id"
          >
            <img :src="petTypes[id].icon" :alt="petTypes[id].quality" width="64" />
          </v-chip>
        </v-chip-group>

        <h2 v-if="selectedType" class="text-title-large my-3">Что будете делать с питомцем?</h2>

        <v-radio-group inline v-if="selectedType" v-model="selectedAction">
          <v-radio label="Призыв" value="summon" />
          <v-radio label="Поднятие уровня" value="level-up" />
        </v-radio-group>

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
          />
        </template>

        <div v-if="previewTotal?.incomplete" class="mt-2 text-error">
          Нет данных для уровня {{ previewTotal.rows.find(r => r.missing)?.level }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDialog">Отмена</v-btn>
        <v-btn :disabled="!canConfirm" color="primary" variant="tonal" @click="confirm">
          {{ isEditing ? 'Сохранить' : 'Добавить' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
