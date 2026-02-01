<script setup>
import {charmItems as items} from '@/config/charm.js'
import {useCharmStore} from "@/stores/charm.js";
const store = useCharmStore()

// const totals = computed(() => ({
//   blueHadak: Math.floor(
//     calculatorData.value.blueHadak * calculatorData.value.concubines * formulaSettings.value.charm.blueHadak),
//   whiteHadak: calculatorData.value.whiteHadak * calculatorData.value.concubines,
//   goldHairpin: calculatorData.value.goldHairpin * 5,
//   silverHairpin: Math.floor(calculatorData.value.silverHairpin * formulaSettings.value.charm.silverHairpin),
//   perfume: calculatorData.value.perfume,
//   chests: Math.floor(calculatorData.value.chests * formulaSettings.value.charm.chests),
//   forage: Math.floor(calculatorData.value.forage * formulaSettings.value.charm.forage),
// }));

const saveValues = () => {
  store.setCharmValues(store.charmValues)
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
              v-model="store.charmValues.concubines"
              @update:model-value="saveValues"
              :name="`${Math.random().toString(36).substring(2)}`"
              type="number"
              min="0"
              @click="e => e.target.select()"
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
              @click="e => e.target.select()"
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
      Итого:
    </v-card-title>

  </v-bottom-navigation>
</template>

<style scoped lang="sass">

</style>
