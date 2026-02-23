<script setup>
import {ref} from "vue";
import {useTheme} from "vuetify/framework";
import {steppeQueensInsigniaIcon} from "@/config/gok-item-icon-set.js";

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
  },
  extendLevelInfo: {
    type: Object,
    default: {}
  },
  tokenIcon: {
    type: Object,
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
  <v-divider class="my-3"/>
  <v-table hover style="margin-bottom: 50px">
    <thead>
    <tr>
      <th style="width: 33%">Уровень гармонии</th>
      <th style="width: 33%">
        <div class="d-flex align-center">
          <div>Кол-во жетонов</div>
          <GokIcon v-if="tokenIcon" :icon="tokenIcon" size="48" />
        </div>
      </th>
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
      <td class="d-flex align-center">
        <div>{{ level.lvl }}</div>
          <v-tooltip :open-on-hover="false" open-on-click>
            <template v-slot:activator="{ props }">
              <i-mdi-info  v-bind="props" class="align-center ms-3" v-if="extendLevelInfo[level.lvl] !== undefined" />
            </template>
            <span>{{extendLevelInfo[level.lvl]}}</span>
          </v-tooltip>
      </td>
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
      Выберите нужный вам уровень гармонии, а также выберите советников какие уже призваны (для Варваров, Воительниц и дочерей Вечности)
    </v-card>
  </v-bottom-navigation>
</template>

<style scoped lang="sass">

</style>
