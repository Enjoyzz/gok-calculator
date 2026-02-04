<script setup>
import {defaultValues, meatItems as items} from '@/config/meat.js';
import {useMeatStore} from '@/stores/meat.js';
import CalculatorBottom from '@/components/CalculatorBottom.vue';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import meatGenIcon from '@/assets/img/icon/1-3.png';
import {debounce} from '@/utils/debounce.js';

const store = useMeatStore();

const input = ref(store.meatValues);

const totals = computed(() => ({
  meat88K_8M: input.value.meat88K_8M * 4_000_000,

  meat10M: input.value.meat10M * 10_000_000,
  meat1M: input.value.meat1M * 1_000_000,
  meat100K: input.value.meat100K * 100_000,

  meat2h: input.value.meat2h * 120 * input.value.meat,
  meat1h: input.value.meat1h * 60 * input.value.meat,
  meat30m: input.value.meat30m * 30 * input.value.meat,
  meat15m: input.value.meat15m * 15 * input.value.meat,
  meat5m: input.value.meat5m * 5 * input.value.meat,

  medal: input.value.medal * 30 * input.value.meat,
  chest: input.value.chest * 60 * input.value.meat,
}));

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveInputValues = debounce((values) => {
  store.setMeatValues(values);
}, 500);

watch(input, (newValue) => {
    saveInputValues(newValue);
  }, {deep: true},
);

</script>

<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              variant="outlined"
              label="Выработка мяса"
              persistent-hint
              density="comfortable"
              v-model="input.meat"
              :name="`${Math.random().toString(36).substring(2)}`"
              type="number"
              hide-spin-buttons
              min="0"
              @focus="e => e.target.select()"

            >
              <template #append-inner>
                <div class="container2">
                  <div style="display: flex; gap: 0; align-items: center">
                    <div class="icon">
                      <img :src="meatGenIcon">
                    </div>
                    <div class="text">{{
                        formatLargeNumber(input.meat, {
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
                <GokIcon :icon="item.icon" :size="72"/>
              </v-col>
              <v-col class="flex-grow-1">
                <v-text-field
                  variant="outlined"
                  v-model="input[item.id]"
                  @click:clear="input[item.id] = defaultValues[item.id] || 0"
                  :name="`${Math.random().toString(36).substring(2)}`"
                  active
                  density="comfortable"
                  type="number"
                  min="0"
                  clearable
                  hide-spin-buttons
                  @focus="e => e.target.select()"
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
