<script setup>
import {charmItems as items} from '@/config/charm.js';
import {useCharmStore} from '@/stores/charm.js';
import {formatLargeNumber} from '@/utils/formatNumbers.js';

const store = useCharmStore();

const totals = computed(() => ({
  blueHadak: Math.floor(
    store.charmValues.blueHadak * store.charmValues.concubines * store.charmSettings.blueHadak),
  whiteHadak: Number(store.charmValues.whiteHadak * store.charmValues.concubines),
  goldHairpin: Number(store.charmValues.goldHairpin * 5),
  silverHairpin: Math.floor(store.charmValues.silverHairpin * store.charmSettings.silverHairpin),
  perfume: Number(store.charmValues.perfume),
  chests: Math.floor(store.charmValues.chests * store.charmSettings.chests),
  forage: Math.floor(store.charmValues.forage * store.charmSettings.forage),
}));

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveValues = () => {
  store.setCharmValues(store.charmValues);
};

</script>

<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              variant="outlined"
              label="Количество наложниц"
              persistent-hint
              density="comfortable"
              v-model="store.charmValues.concubines"
              @update:model-value="saveValues"
              :name="`${Math.random().toString(36).substring(2)}`"
              type="number"
              min="0"
              @focus="e => e.target.select()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-for="item in items" :key="item.id">
          <v-col class="flex-grow-0">
            <GokIcon :bg="item.icon.bg" :icon="item.icon.src" :size="72"/>
          </v-col>
          <v-col class="flex-grow-1">
            <v-text-field
              variant="outlined"
              v-model="store.charmValues[item.id]"
              @update:model-value="saveValues"
              :label="item.name"
              :name="`${Math.random().toString(36).substring(2)}`"
              :hint="item.description"
              persistent-hint
              active
              density="comfortable"
              type="number"
              min="0"
              @focus="e => e.target.select()"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <v-bottom-navigation
    color="primary"
  >
    <v-card-title>
      Итого: {{ formatLargeNumber(total, {removeZero: true}) }}
    </v-card-title>

  </v-bottom-navigation>
</template>

<style scoped lang="sass">

</style>
