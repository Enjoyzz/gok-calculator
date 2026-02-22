<script setup>
import {ref, watch} from 'vue'
import {useDisplay} from 'vuetify'
import SubImg from "@/assets/hero/100_314.png";
import JelImg from "@/assets/hero/100_311.png";
import HubImg from "@/assets/hero/100_312.png";
import NokImg from "@/assets/hero/100_313.png";
import {useTheme} from "vuetify/framework";

const theme = useTheme();

const {smAndDown} = useDisplay()

const isDarkTheme = ref(null);

watch(theme.current, () => {
  isDarkTheme.value = theme.current.value.dark === true;
}, {immediate: true});

const emit = defineEmits([
  'close-dialog',
])

const dialog = ref(true)
const selectedLevel = ref(null)

const onSelectLevel = function (lvl) {
  if (selectedLevel.value === lvl) {
    selectedLevel.value = null
    return;
  }
  selectedLevel.value = lvl
}

const summary = computed(() => {
  if (!selectedLevel.value) {
    return;
  }

  const total = allLevels.value
    .filter(item => item.lvl <= selectedLevel.value)
    .reduce((sum, level) => sum + level.tokens, 0);

  return {
    lvl: selectedLevel.value,
    total: total,
    bonus: (selectedLevel.value * 3) + groupBonus.value
  }
})

const allLevels = computed(() => {
  const levels = [];

  // Уровни 1-8
  for (let i = 1; i <= 8; i++) {
    levels.push({
      lvl: i,
      tokens: ((i) * 2) + 4,
      bonus: i * 3,
    });
  }

  // Уровни 9-20
  for (let i = 9; i <= 20; i++) {
    levels.push({
      lvl: i,
      tokens: 20,
      bonus: i * 3,
    });
  }

  // Уровни 21-40
  for (let i = 21; i <= 40; i++) {
    levels.push({
      lvl: i,
      tokens: ((i - 20) * 5) + 20,
      bonus: i * 3,
    });
  }

  return levels;
})

const items = ref([
  {src: HubImg},
  {src: SubImg},
  {src: JelImg},
  {src: NokImg},
])
const selection = ref([0, 1, 2, 3])

const groupBonus = computed(() => {
  return selection.value.length * 5;
})

</script>

<template>
  <v-dialog
    v-model="dialog"
    @afterLeave="$emit('close-dialog')"
    :fullscreen="smAndDown"
    max-width="500"
    scrollable
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <v-card-title class="my-0 py-0">
            Варвары
          </v-card-title>
          <v-card-subtitle class="my-0 py-0">
            гармония
          </v-card-subtitle>
        </v-toolbar-title>
        <template #append>
          <v-btn
            @click="dialog = false"
            icon
          >
            <v-icon>
              <i-mdi-close/>
            </v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-item-group
          v-model="selection"
          multiple
          class="d-flex align-center"
        >
          <v-item v-for="(item, i) in items"
                  :key="i"
                  v-slot="{ isSelected, toggle }">
            <v-img
              :src="item.src"
              cover
              inline
              width="64"
              @click="toggle"
            >
              <i-mdi-check-circle v-if="isSelected"/>
            </v-img>
          </v-item>

          <v-item>
            <span v-if="groupBonus > 0" class="ps-3 text-h6">+{{ groupBonus }}%</span>
          </v-item>

        </v-item-group>


        <div class="text-start">

        </div>
        <v-table hover style="margin-bottom: 50px">
          <thead>
          <tr>
            <th style="width: 33%">Уровень гармонии</th>
            <th style="width: 33%">Кол-во жетонов</th>
            <th style="width: 33%">Бонус атрибутов,&nbsp;%</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="level in allLevels"
            :key="level.lvl"
            @click="onSelectLevel(level.lvl)"
            :class="{'bg-red': selectedLevel === level.lvl}"
          >
            <td>{{ level.lvl }}</td>
            <td>{{ level.tokens }}</td>
            <td>{{ level.bonus }}%</td>
          </tr>
          </tbody>
          <tfoot>

          </tfoot>
        </v-table>
      </v-card-text>

    </v-card>
    <v-bottom-navigation
      elevation="16"
      absolute
      style="left: 0!important; width: 100%!important;"
      :class="{'bg-grey-lighten-3': !isDarkTheme, 'bg-blue-grey-darken-4': isDarkTheme}">
      <div v-if="summary" class="d-flex">

        <v-card elevation="0" class="px-0 text-center flex-grow-1" density="compact" color="transparent">
          <template #title>
            #{{ summary.lvl }}
          </template>
          <template #subtitle>
            Уровень
          </template>
        </v-card>

        <v-card elevation="0" class="px-0 text-center flex-grow-1" density="compact" color="transparent">
          <template #title>
            {{ summary.total }}
          </template>
          <template #subtitle>
            Всего жетонов
          </template>
        </v-card>

        <v-card elevation="0" class="px-0 text-center flex-grow-1" density="compact" color="transparent">
          <template #title>
            +{{ summary.bonus }}%
          </template>
          <template #subtitle>
            Общий бонус
          </template>
        </v-card>


      </div>

      <v-card v-else class="pa-3 font-weight-bold">
        <v-icon color="error" class="p-3"><i-mdi-warning /></v-icon>
        Выберите нужный вам уровень гармонии, а также выберите советников какие уже призваны
      </v-card>
    </v-bottom-navigation>
  </v-dialog>


</template>

<style scoped lang="sass">

</style>
