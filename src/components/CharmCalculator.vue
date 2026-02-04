<script setup>
import {charmItems as items, defaultCharmSettings, defaultValues, multiplierConstraints} from '@/config/charm.js';
import {useCharmStore} from '@/stores/charm.js';
import CalculatorBottom from '@/components/CalculatorBottom.vue';
import {debounce} from '@/utils/debounce.js';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import {useGenerateBadge} from '@/composable/badges.js';

const store = useCharmStore();

const input = ref(store.charmValues);

const totals = computed(() => ({
  blueHadak: Math.floor(
    input.value.blueHadak * input.value.concubines * store.charmSettings.blueHadak),
  whiteHadak: Number(input.value.whiteHadak * input.value.concubines),
  goldHairpin: Number(input.value.goldHairpin * 5),
  silverHairpin: Math.floor(input.value.silverHairpin * store.charmSettings.silverHairpin),
  perfume: Number(input.value.perfume),
  chests: Math.floor(input.value.chests * store.charmSettings.chests),
  forage: Math.floor(input.value.forage * store.charmSettings.forage),
}));

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveInputValues = debounce((values) => {
  store.setCharmValues(values);
}, 500);

watch(input, (newValue) => {
    saveInputValues(newValue);
  }, {deep: true},
);

const saveSettings = function(settings) {
  store.setCharmSettings(settings);
};

const handleOnFocus = (e) => {
  e.target.select()
  e.target.name = 'tmp_' + Date.now();
}

const generateBadge = (item) => {
  if (totals.value[item.id] > 0) {
    return (item.approximately === true ? '~' : '') + formatLargeNumber(totals.value[item.id], {removeZero: true})
  }
  return null
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
              label="Количество наложниц"
              persistent-hint
              density="comfortable"
              v-model="input.concubines"
              type="number"
              min="0"
              @focus="handleOnFocus"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" v-for="item in items" :key="item.id">
            <v-row>
              <v-col class="flex-grow-0 pt-0">
                <GokIcon :icon="item.icon" :size="72" :badge="useGenerateBadge(totals[item.id], item.approximately)"/>
              </v-col>
              <v-col class="flex-grow-1">
                <v-text-field
                  variant="outlined"
                  v-model="input[item.id]"
                  @click:clear="input[item.id] = defaultValues[item.id] || 0"
                  :hint="item.description"
                  persistent-hint
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
                  <span class="font-weight-bold">&times; {{ store.charmSettings[item.id] }}</span>
                </span>
                    <span v-else>{{ item.name }}</span>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <CalculatorBottom
    :total="total"
    :settings="{
      items: items,
      input: store.charmSettings,
      defaults: defaultCharmSettings,
      constraints: multiplierConstraints
    }"
    @save-settings="saveSettings"
  />
</template>

<style scoped lang="sass">

</style>
