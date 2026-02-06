<script setup>
import {
  defaultIntimacySettings,
  defaultValues,
  intimacyItems as items,
  multiplierConstraints,
} from '@/config/intimacy.js';
import {useIntimacyStore} from '@/stores/intimacy.js';
import CalculatorBottom from '@/components/CalculatorBottom.vue';
import {debounce} from '@/utils/debounce.js';
import {useGenerateBadge} from '@/composable/badges.js';

const store = useIntimacyStore();

const input = ref(store.intimacyValues);

const totals = computed(() => ({
  ordos: Math.floor(
    (input.value.ordos || defaultValues.ordos) * (input.value.concubines || defaultValues.concubines) * store.intimacySettings.ordos),
  takya: Number((input.value.takya || defaultValues.takya) * (input.value.concubines || defaultValues.concubines)),
  jadeBracelet: Number((input.value.jadeBracelet || defaultValues.jadeBracelet) * 5),
  sandalwoodBracelet: Math.floor(
    (input.value.sandalwoodBracelet || defaultValues.sandalwoodBracelet) * store.intimacySettings.sandalwoodBracelet),
  goldEarrings: Number((input.value.goldEarrings || defaultValues.goldEarrings) * 2),
  gemRing: Number(input.value.gemRing || defaultValues.gemRing),
  loveLetter: Number(input.value.loveLetter || defaultValues.loveLetter),
  forage: Math.floor((input.value.forage || defaultValues.forage) * store.intimacySettings.forage),
}));

const total = computed(() =>
  Object.values(totals.value).reduce((sum, val) => sum + val, 0),
);

const saveInputValues = debounce((values) => {
  store.setIntimacyValues(values);
}, 500);

watch(input, (newValue) => {
    saveInputValues(newValue);
  }, {deep: true},
);

const saveSettings = function (settings) {
  store.setIntimacySettings(settings);
};

const handleOnFocus = (e) => {
  e.target.select();
  e.target.name = 'tmp_' + Date.now();
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
                      <span class="font-weight-bold"><span
                        :class="{'text-error': String(store.intimacySettings[item.id]) !== String(defaultIntimacySettings[item.id])}">x{{
                          store.intimacySettings[item.id]
                        }}</span></span>
                      {{ item.name }}
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
      input: store.intimacySettings,
      defaults: defaultIntimacySettings,
      constraints: multiplierConstraints
    }"
    @save-settings="saveSettings"
  />
</template>

<style scoped lang="sass">

</style>
