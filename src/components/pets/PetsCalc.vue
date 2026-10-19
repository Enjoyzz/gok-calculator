<script setup>
import { ref, computed, watch } from 'vue'
import { usePets } from '@/composable/usePets'
import { petTypes, petTypeKeys } from '@/config/petTypes'


const addPetDialog = ref(false)
const editingId = ref(null) // null = создание, иначе id редактируемой записи

const selectedType = ref(null)
const selectedAction = ref(null)
const currentLevel = ref(null)
const desiredLevel = ref(null)

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

function openEdit(pet) {
  editingId.value = pet.id
  selectedType.value = pet.type
  selectedAction.value = pet.action
  currentLevel.value = pet.currentLevel
  desiredLevel.value = pet.desiredLevel
  addPetDialog.value = true
}

// --- подтверждение ---

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

// При смене типа — сбрасываем зависимые поля (но не при открытии на редактирование)
let initializing = false
watch(selectedType, () => {
  if (initializing) return
  selectedAction.value = null
  currentLevel.value = null
  desiredLevel.value = null
})

watch(selectedAction, (action) => {
  if (initializing) return
  if (action === 'summon') {
    currentLevel.value = null
    desiredLevel.value = null
  }
})

// В openEdit порядок: сначала выставляем всё, потом снимаем флаг
// (если выставление вызывает watch, они не должны затереть поля)
function openEditSafely(pet) {
  initializing = true
  openEdit(pet)
  initializing = false
}
</script>

<template>
  <v-card>
    <v-card-title>Питомцы</v-card-title>

    <v-card-text>
      <v-btn color="primary" @click="openCreate">Добавить животину</v-btn>
    </v-card-text>

    <v-list v-if="petsWithCost.length" density="compact">
      <v-list-item v-for="pet in petsWithCost" :key="pet.id">
        <v-list-item-title>
          {{ pet.quality }} —
          {{ pet.action === 'summon'
          ? 'призыв'
          : `ур. ${pet.currentLevel} → ${pet.desiredLevel}` }}
        </v-list-item-title>

        <v-list-item-subtitle>
          <template v-if="pet.total.incomplete">
            <span class="text-error">
              нет данных для ур. {{ pet.total.rows.find(r => r.missing)?.level }}
            </span>
          </template>
          <template v-else>
            части {{ pet.total.parts }},
            ягоды {{ pet.total.berries }},
            очки {{ pet.total.points }}
          </template>
        </v-list-item-subtitle>

        <template #append>
          <v-menu location="end">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-information-outline" size="small" variant="text" />
            </template>
            <v-card min-width="280">
              <v-table density="compact">
                <thead>
                <tr><th>Уровень</th><th>Части</th><th>Ягоды</th><th>Очки</th></tr>
                </thead>
                <tbody>
                <tr v-for="row in breakdown(pet)" :key="row.level">
                  <td>{{ row.level }}</td>
                  <td v-if="row.missing" colspan="3" class="text-error">нет данных</td>
                  <template v-else>
                    <td>{{ row.parts }}</td>
                    <td>{{ row.berries }}</td>
                    <td>{{ row.points }}</td>
                  </template>
                </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-menu>

          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="openEditSafely(pet)"
          />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="removePet(pet.id)"
          />
        </template>
      </v-list-item>
    </v-list>

    <v-divider v-if="petsWithCost.length" />

    <v-card-text v-if="petsWithCost.length">
      <strong>Итого:</strong>
      части {{ totals.parts }},
      ягоды {{ totals.berries }},
      очки {{ totals.points }}
    </v-card-text>
  </v-card>

  <v-dialog v-model="addPetDialog" max-width="500px">
    <v-card>
      <v-card-title>
        {{ isEditing ? 'Редактировать питомца' : 'Новый питомец' }}
      </v-card-title>

      <v-card-text>
        <v-radio-group inline v-model="selectedType" label="Выберите качество боевого питомца">
          <v-radio
            v-for="id in petTypeKeys"
            :key="id"
            :label="petTypes[id].quality"
            :value="id"
          />
        </v-radio-group>

        <v-radio-group inline v-model="selectedAction" label="Что будете делать с питомцем?">
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

        <div v-if="previewTotal && !previewTotal.incomplete" class="mt-2">
          Будет списано: части {{ previewTotal.parts }},
          ягоды {{ previewTotal.berries }},
          очки {{ previewTotal.points }}
        </div>
        <div v-else-if="previewTotal?.incomplete" class="mt-2 text-error">
          Нет данных для уровня {{ previewTotal.rows.find(r => r.missing)?.level }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDialog">Отмена</v-btn>
        <v-btn :disabled="!canConfirm" color="primary" @click="confirm">
          {{ isEditing ? 'Сохранить' : 'Добавить' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
