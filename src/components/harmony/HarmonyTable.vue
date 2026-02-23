<script setup>
import {ref} from "vue";
import {useTheme} from "vuetify/framework";

const theme = useTheme();
const isDarkTheme = ref(null);

watch(theme.current, () => {
  isDarkTheme.value = theme.current.value.dark === true;
}, {immediate: true});

const props = defineProps({
  levels: {
    type: Array,
    required: true
  },
  groupBonus: {
    type: Number
  },
  bonusPerLevel: {
    type: Number,
    default: 3
  }
})

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

  const total = props.levels
    .filter(item => item.lvl <= selectedLevel.value)
    .reduce((sum, level) => sum + level.tokens, 0);

  return {
    lvl: selectedLevel.value,
    total: total,
    bonus: (selectedLevel.value * props.bonusPerLevel) + (props.groupBonus || 0)
  }
})

</script>

<template>
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
      v-for="level in levels"
      :key="level.lvl"
      @click="onSelectLevel(level.lvl)"
      :class="{'bg-red': selectedLevel === level.lvl}"
    >
      <td>{{ level.lvl }}</td>
      <td>{{ level.tokens }}</td>
      <td>{{ level.lvl * bonusPerLevel }}%</td>
    </tr>
    </tbody>
    <tfoot>

    </tfoot>
  </v-table>
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
</template>

<style scoped lang="sass">

</style>
