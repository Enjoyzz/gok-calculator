<script setup>
import {intimacyItems as items} from '@/config/intimacy.js';
import {useIntimacyStore} from '@/stores/intimacy.js';
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import CalculatorBottom from '@/components/CalculatorBottom.vue';

const store = useIntimacyStore();

const totals = computed(() => ({
  ordos: Math.floor(
    store.intimacyValues.ordos * store.intimacyValues.concubines * store.intimacySettings.ordos),
  takya: Number(store.intimacyValues.takya * store.intimacyValues.concubines),
  jadeBracelet: Number(store.intimacyValues.jadeBracelet * 5),
  sandalwoodBracelet: Math.floor(
    store.intimacyValues.sandalwoodBracelet * store.intimacySettings.sandalwoodBracelet),
  goldEarrings: Number(store.intimacyValues.goldEarrings * 2),
  gemRing: Number(store.intimacyValues.gemRing),
  loveLetter: Number(store.intimacyValues.loveLetter),
  forage: Math.floor(store.intimacyValues.forage * store.intimacySettings.forage),
}));

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveValues = () => {
  store.setIntimacyValues(store.intimacyValues);
};

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
              v-model="store.intimacyValues.concubines"
              @update:model-value="saveValues"
              :name="`${Math.random().toString(36).substring(2)}`"
              type="number"
              min="0"
              @focus="e => e.target.select()"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" v-for="item in items" :key="item.id">
            <v-row>
              <v-col class="flex-grow-0 pt-0">
                <GokIcon :bg="item.icon.bg" :icon="item.icon.src" :size="72"/>
              </v-col>
              <v-col class="flex-grow-1">
                <v-text-field
                  variant="outlined"
                  v-model="store.intimacyValues[item.id]"
                  @update:model-value="saveValues"
                  :name="`${Math.random().toString(36).substring(2)}`"
                  :hint="item.description"
                  persistent-hint
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
                  <span class="font-weight-bold">&times; {{ store.intimacySettings[item.id] }}</span>
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
  <CalculatorBottom :total=" '~&nbsp;' + formatLargeNumber(total, {removeZero: true})" />
</template>

<style scoped lang="sass">

</style>
