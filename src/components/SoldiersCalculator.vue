<script setup>
import {defaultValues, soldiersItems as items} from '@/config/soldiers.js';
import {useSoldiersStore} from '@/stores/soldiers.js';
import CalculatorBottom from '@/components/CalculatorBottom.vue';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import soldiersGenIcon from '@/assets/img/icon/1-4.png';
import {debounce} from '@/utils/debounce.js';
import {useGenerateBadge} from '@/composable/badges.js';

const store = useSoldiersStore();

const input = ref(store.soldiersValues);

const totals = computed(() => ({
  soldiers88K_8M: (input.value.soldiers88K_8M || defaultValues.soldiers88K_8M) * 4_000_000,

  soldiers10M: (input.value.soldiers10M || defaultValues.soldiers10M) * 10_000_000,
  soldiers1M: (input.value.soldiers1M || defaultValues.soldiers1M) * 1_000_000,
  soldiers100K: (input.value.soldiers100K || defaultValues.soldiers100K) * 100_000,

  soldiers2h: (input.value.soldiers2h || defaultValues.soldiers2h) * 120 * (input.value.soldiers || defaultValues.soldiers),
  soldiers1h: (input.value.soldiers1h || defaultValues.soldiers1h) * 60 * (input.value.soldiers || defaultValues.soldiers),
  soldiers30m: (input.value.soldiers30m || defaultValues.soldiers30m) * 30 * (input.value.soldiers || defaultValues.soldiers),
  soldiers15m: (input.value.soldiers15m || defaultValues.soldiers15m) * 15 * (input.value.soldiers || defaultValues.soldiers),
  soldiers5m: (input.value.soldiers5m || defaultValues.soldiers5m) * 5 * (input.value.soldiers || defaultValues.soldiers),

  medal: (input.value.medal || defaultValues.medal) * 30 * (input.value.soldiers || defaultValues.soldiers),
  chest: (input.value.chest || defaultValues.chest) * 60 * (input.value.soldiers || defaultValues.soldiers),
}));

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveInputValues = debounce((values) => {
  store.setSoldiersValues(values);
}, 500);

watch(input, (newValue) => {
    saveInputValues(newValue);
  }, {deep: true},
);

const handleOnFocus = (e) => {
  e.target.select()
  e.target.name = 'tmp_' + Date.now();
}

</script>

<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              variant="outlined"
              label="Выработка солдат"
              persistent-hint
              density="comfortable"
              v-model="input.soldiers"
              type="number"
              hide-spin-buttons
              min="0"
              @focus="handleOnFocus"

            >
              <template #append-inner>
                <div class="container2">
                  <div style="display: flex; gap: 0; align-items: center">
                    <div class="icon">
                      <img :src="soldiersGenIcon">
                    </div>
                    <div class="text">{{
                        formatLargeNumber(input.soldiers, {
                          removeZero: false,
                          currency: ' / мин.',
                          withCurrency: true,
                        })
                      }}
                    </div>
                  </div>
                </div>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" md="6" v-for="item in items" :key="item.id">
            <v-row>
              <v-col class="flex-grow-0 pt-0">
                <GokIcon :icon="item.icon" :size="72"  :badge="useGenerateBadge(totals[item.id], item.approximately)"/>
              </v-col>
              <v-col class="flex-grow-1">
                <v-text-field
                  variant="outlined"
                  v-model="input[item.id]"
                  @click:clear="input[item.id] = defaultValues[item.id] || 0"
                  active
                  density="comfortable"
                  type="number"
                  min="0"
                  clearable
                  hide-spin-buttons
                  @focus="handleOnFocus"
                >
                  <template #label>
                    <span v-if="item.approximately">
                      {{ item.name }}
                    </span>
                    <span v-else>{{ item.name }}</span>
                  </template>
                  <template #details>
                    <span v-html="item.description" class="opacity-70"></span>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <CalculatorBottom :total="total"/>
</template>

<style scoped lang="css">

.container2 {
  display: flex;
  align-items: center;
  gap: 10px; /* Расстояние между иконкой и текстом */
  padding: 0 5px;
  white-space: nowrap;
}

.container2 .icon {

  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-surface-light));
  overflow: hidden; /* Обрезаем лишнее, если изображение больше блока */
}

.container2 .icon img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Изображение заполняет блок без искажений */
}

.container2 .text {
  margin-left: -5px;
  font-size: small;
  padding: 3px 5px 3px 6px;
  background-color: rgb(var(--v-theme-surface-light));
  border-radius: 0 7px 7px 0;
  white-space: nowrap;
  cursor: pointer;
}
</style>
