<script setup>
import {
  CLASS_ORDER,
  defaultValues,
  petTypeBoonGeneralItems as items,
  petTypeBoonSecondItems, POINTS, RATE, SHARE,
  TOOL_ORDER
} from '@/config/pet-type-boon.js';
import {usePetTypeBoonRawStore} from '@/stores/pet-type-boon.js';
import CalculatorBottom from '@/components/CalculatorBottom.vue';
import {debounce} from '@/utils/debounce.js';
import {useGenerateBadge} from '@/composable/badges.js';
import ScreenshotImport from "@/components/ScreenshotImport.vue";
import {calcHunted, staminaFromPills} from "@/composable/petTypeBoonCalc.js";

const store = usePetTypeBoonRawStore();

const input = ref(store.petTypeBoonValues);

const num = id => Number(input.value[id]) || 0

const stamina = computed(() => staminaFromPills(input.value.staminaPill))

const tools = computed(() => ({
  huntingNet: input.value.huntingNet,
  fishingNet: input.value.fishingNet,
  rope: input.value.rope,
}))

const totals = computed(() => ({
  staminaPill: calcHunted(stamina.value, tools.value),
  blackGranite: num('blackGranite') * 300,
  cedarWood: num('cedarWood') * 100,
  radiantStripes: num('radiantStripes') * 50,
}))

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveInputValues = debounce((values) => {
  store.setPetTypeBoonValues(values);
}, 500);

watch(input, (newValue) => {
    saveInputValues(newValue);
  }, {deep: true},
);

const handleOnFocus = (e) => {
  e.target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
  e.target.select()
  e.target.name = 'tmp_' + Date.now();
}


</script>

<template>

  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <ScreenshotImport :items="[...items, ...petTypeBoonSecondItems]" @import="counts => Object.assign(input, counts)" class="my-3" />

          </v-col>
        </v-row>
        <v-row>
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
        <v-row>
          <v-col>
            <v-alert type="info" variant="tonal" density="compact" class="mb-4 text-body-small">
              Расчёт приблизительный. Шансы ловли в игре не показываются и подобраны по наблюдениям.
              Лучшие средства считаются на лучших питомцев, остальные ловятся руками.
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" v-for="item in petTypeBoonSecondItems" :key="item.id">
            <v-row>
              <v-col class="flex-grow-0 pt-0">
                <GokIcon :icon="item.icon" :size="72" :badge="useGenerateBadge(totals[item.id], item.approximately)"/>
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
