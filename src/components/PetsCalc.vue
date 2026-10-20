<script setup>
import { ref, computed, watch } from 'vue'
import { usePets } from '@/composable/usePets'
import { petTypes, petTypeKeys } from '@/config/petTypes'
import iMdiClose from '~icons/mdi/close'
import iMdiPencil from '~icons/mdi/pencil'
import iMdiPlus from '~icons/mdi/plus'
import iMdiDeleteOutline from '~icons/mdi/delete-outline'
import iMdiDotsV from '~icons/mdi/dots-vertical'
import iMdiCalc from '~icons/mdi/calculator'
import petSplash from '@/assets/pet/petking/spt_5503_503.png'

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
  addPet, updatePet, removePet, clearPets,
  totals, petsWithCost, petTotal,
} = usePets(petTypes)

const confirmClearDialog = ref(false)

const currentPetType = computed(() => petTypes[selectedType.value] ?? null)
const minLevel = computed(() => currentPetType.value?.['min-level'] ?? 1)
const maxLevel = computed(() => currentPetType.value?.['max-level'])

const budgetDialog = ref(false)
const budgetShards = ref(null)

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
  previewTotal.value &&
  !previewTotal.value.incomplete &&   // hasMissing блокирует
  previewTotal.value.parts + previewTotal.value.berries + previewTotal.value.points > 0
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

function doClearAll() {
  clearPets()
  confirmClearDialog.value = false
  if (addPetDialog.value) {
    closeDialog()
  }
}

function isApprox(total, field) {
  return total?.approxFields?.includes(field) ?? false
}

const fieldLabels = { parts: 'осколки', berries: 'ягодки', points: 'очки' }
const unknownLabels = (total) =>
  (total?.unknownFields ?? []).map(f => fieldLabels[f]).filter(Boolean).join(', ')


function findMaxLevel(type, currentLevel, budget) {
  const typeData = petTypes[type]
  if (!typeData || currentLevel == null || budget == null) return null

  let spent = 0
  let lastLevel = currentLevel

  for (let lvl = currentLevel + 1; lvl <= typeData['max-level']; lvl++) {
    const cost = typeData.levels?.[lvl]
    if (!cost || cost.parts == null) break
    if (spent + cost.parts > budget) break
    spent += cost.parts
    lastLevel = lvl
  }

  return lastLevel > currentLevel ? lastLevel : null
}

function openBudgetDialog() {
  budgetShards.value = null
  budgetDialog.value = true
}

function applyBudget() {
  const max = findMaxLevel(selectedType.value, currentLevel.value, budgetShards.value)
  if (max != null) {
    desiredLevel.value = max
  }
  budgetDialog.value = false
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
    <v-card-text  v-if="petsWithCost.length" class="d-flex align-center justify-space-between">
      <v-btn color="primary" variant="tonal" :prepend-icon="iMdiPlus" @click="openCreate">
        Добавить боевого питомца
      </v-btn>

      <v-btn

        color="error"
        title="Очистить всё"
        variant="text"
        :prepend-icon="iMdiDeleteOutline"
        @click="confirmClearDialog = true"
      >

      </v-btn>
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
          <td>
            <template v-if="pet.total.unknownFields.includes('parts')">?</template>
            <template v-else>
              <template v-if="isApprox(pet.total, 'parts')">~</template>{{ pet.total.parts }}
            </template>
          </td>
          <td>
            <template v-if="pet.total.unknownFields.includes('berries')">?</template>
            <template v-else>
              <template v-if="isApprox(pet.total, 'berries')">~</template>{{ pet.total.berries }}
            </template>
          </td>
          <td>
            <template v-if="pet.total.unknownFields.includes('points')">?</template>
            <template v-else>
              <template v-if="isApprox(pet.total, 'points')">~</template>
              {{ formatLargeNumber(pet.total.points, { removeZero: true }) }}
            </template>
          </td>
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
      <v-card-text
        v-if="totals.unknownFields.length"
        class="text-caption text-warning mt-3"
      >
        Внимание: часть значений неизвестны «{{ unknownLabels(totals) }}» — эти значения не учтены в итоговой сумме.
      </v-card-text>

      <v-card-text class="d-flex ga-4 align-center font-weight-bold">
        <span class="text-body-large">Итого очков:</span>
        <span class="text-headline-small">
          <template v-if="isApprox(totals, 'points') || totals.unknownFields.includes('points')">~</template>
          {{ formatLargeNumber(totals.points, { removeZero: true }) }}
        </span>
      </v-card-text>

      <v-card-text v-if="totals.berries > 0" class="d-flex ga-4 mt-5 align-center font-weight-bold">
        <span class="text-body-large">Также необходимо:</span>
        <GokIcon :icon="berriesIcon" :size="72" :badge="useGenerateBadge(totals.berries, isApprox(totals, 'berries') ||  totals.unknownFields.includes('berries'))" />
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
          >
            <template #append-inner>
              <v-tooltip text="Рассчитать по осколкам">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :icon="iMdiCalc"
                    size="small"
                    variant="text"
                    :disabled="!currentLevel"
                    @click="openBudgetDialog"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
        </template>

        <div v-if="previewTotal?.hasUnknown" class="mt-2 text-warning">
          Некоторые значения неизвестны — они не будут учтены в сумме:
          <template v-if="previewTotal.unknownFields.includes('parts')">осколки</template>
          <template v-if="previewTotal.unknownFields.includes('berries')">, ягоды</template>
          <template v-if="previewTotal.unknownFields.includes('points')">, очки</template>
        </div>
        <div v-if="previewTotal?.incomplete" class="mt-2 text-error">
          Нет данных для уровня {{ previewTotal.rows.find(r => r.missing)?.level }} — добавление невозможно
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

  <v-dialog v-model="confirmClearDialog" max-width="420px">
    <v-card>
      <v-card-title>Очистить список?</v-card-title>
      <v-card-text>
        Будут удалены все добавленные питомцы ({{ petsWithCost.length }}).
        Действие нельзя отменить.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="confirmClearDialog = false">Отмена</v-btn>
        <v-btn color="error" variant="flat" @click="doClearAll">Очистить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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

        <div
          v-if="budgetShards != null && currentLevel != null"
          class="text-caption text-medium-emphasis"
        >
          <template v-if="findMaxLevel(selectedType, currentLevel, budgetShards)">
            На {{ budgetShards }} осколков хватит до ур.
            {{ findMaxLevel(selectedType, currentLevel, budgetShards) }}
          </template>
          <template v-else>
            Не хватает даже на один уровень.
          </template>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="budgetDialog = false">Отмена</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          :disabled="budgetShards == null || budgetShards <= 0"
          @click="applyBudget"
        >
          Применить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
