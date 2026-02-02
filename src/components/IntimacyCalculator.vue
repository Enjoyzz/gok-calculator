<script setup>
import {intimacyItems as items} from '@/config/intimacy.js'
import {useIntimacyStore} from "@/stores/intimacy.js";
import {formatLargeNumber} from '@/utils/formatNumbers.js';
const store = useIntimacyStore()

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
  store.setIntimacyValues(store.intimacyValues)
}

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
              v-model="store.intimacyValues.concubines"
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
              v-model="store.intimacyValues[item.id]"
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
