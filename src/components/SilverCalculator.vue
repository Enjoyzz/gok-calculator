<script setup>
import {defaultValues, silverItems as items} from '@/config/silver.js';
import {useSilverStore} from '@/stores/silver.js';
import CalculatorBottom from '@/components/CalculatorBottom.vue';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import silverGenIcon from '@/assets/img/icon/1-2.png';
import {debounce} from '@/utils/debounce.js';
import {useGenerateBadge} from '@/composable/badges.js';

const store = useSilverStore();

const input = ref(store.silverValues);

const totals = computed(() => ({
  silver88K_8M: (input.value.silver88K_8M || defaultValues.silver88K_8M) * 4_000_000,

  silver10M: (input.value.silver10M || defaultValues.silver10M) * 10_000_000,
  silver1M: (input.value.silver1M || defaultValues.silver1M) * 1_000_000,
  silver100K: (input.value.silver100K || defaultValues.silver100K) * 100_000,

  silver2h: (input.value.silver2h || defaultValues.silver2h) * 120 * (input.value.silver || defaultValues.silver),
  silver1h: (input.value.silver1h || defaultValues.silver1h) * 60 * (input.value.silver || defaultValues.silver),
  silver30m: (input.value.silver30m || defaultValues.silver30m) * 30 * (input.value.silver || defaultValues.silver),
  silver15m: (input.value.silver15m || defaultValues.silver15m) * 15 * (input.value.silver || defaultValues.silver),
  silver5m: (input.value.silver5m || defaultValues.silver5m) * 5 * (input.value.silver || defaultValues.silver),

  medal: (input.value.medal || defaultValues.medal) * 30 * (input.value.silver || defaultValues.silver),
  chest: (input.value.chest || defaultValues.chest) * 60 * (input.value.silver || defaultValues.silver),
}));

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveInputValues = debounce((values) => {
  store.setSilverValues(values);
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
              label="Выработка серебра"
              persistent-hint
              density="comfortable"
              v-model="input.silver"
              type="number"
              hide-spin-buttons
              min="0"
              @focus="handleOnFocus"

            >
              <template #append-inner>
                <div class="container2">
                  <div style="display: flex; gap: 0; align-items: center">
                    <div class="icon">
                      <img :src="silverGenIcon">
                    </div>
                    <div class="text">{{
                        formatLargeNumber(input.silver, {
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
