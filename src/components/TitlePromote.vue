<script setup>
import {useDisplay} from 'vuetify'
import {
  closeMedalIcon,
  closeSealIcon,
  closeTallyIcon,
  greatMedalIcon,
  greatSealIcon,
  greatTallyIcon,
  highMedalIcon,
  highSealIcon,
  highTallyIcon,
  loyalMedalIcon,
  loyalSealIcon,
  loyalTallyIcon,
  newMedalIcon,
  newSealIcon,
  newTallyIcon,
  trustedMedalIcon,
  trustedSealIcon,
  trustedTallyIcon
} from "@/config/gok-item-icon-set.js";
import lvl150 from '@/assets/title/spt_102_102.png';
import lvl200 from '@/assets/title/spt_102_103.png';
import lvl250 from '@/assets/title/spt_102_104.png';
import lvl300 from '@/assets/title/spt_102_105.png';
import lvl350 from '@/assets/title/spt_102_106.png';
import lvl400 from '@/assets/title/spt_102_107.png';

import red from '@/assets/img/bg/bg-red.png';
import orange from '@/assets/img/bg/bg-orange.png';
import violet from '@/assets/img/bg/bg-violet.png';
import blue from '@/assets/img/bg/bg-blue.png';

import newBox from '@/assets/title/2-4014.png';
import newBoxRandom from '@/assets/title/2-4015.png';
import trustedBox from '@/assets/title/2-4024.png';
import loyalBox from '@/assets/title/2-4034.png';
import closeBox from '@/assets/title/2-4044.png';
import highBox from '@/assets/title/2-4054.png';
import greatBox from '@/assets/title/2-4064.png';

const {smAndDown} = useDisplay()

const lvl = ref({
  lvl150: {
    main: lvl150,
    seal: {
      icon: newSealIcon,
      title: 'Печать пса',
      description: 'Повышает титул советника до Батыра (150ур.)',
      badge: null
    },
    tally: {
      icon: newTallyIcon,
      title: 'Знак шакала',
      description: 'Повышает титул советника до Батыра (150ур.)',
      badge: null
    },
    medal: {
      icon: newMedalIcon,
      title: 'Орден шакала',
      description: 'Повышает титул советника до Батыра (150ур.)',
      badge: null
    }
  },
  lvl200: {
    main: lvl200,
    seal: {
      icon: trustedSealIcon,
      title: 'Печать кабана',
      description: 'Повышает титул советника до Младшего батыра (200ур.)',
      badge: null
    },
    tally: {
      icon: trustedTallyIcon,
      title: 'Знак кабана',
      description: 'Повышает титул советника до Младшего батыра (200ур.)',
      badge: null
    },
    medal: {
      icon: trustedMedalIcon,
      title: 'Орден кабана',
      description: 'Повышает титул советника до Младшего батыра (200ур.)',
      badge: null
    }
  },
  lvl250: {
    main: lvl250,
    seal: {
      icon: loyalSealIcon,
      title: 'Печать волка',
      description: 'Повышает титул советника до Старшего батыра (250ур.)',
      badge: null
    },
    tally: {
      icon: loyalTallyIcon,
      title: 'Знак волка',
      description: 'Повышает титул советника до Старшего батыра (250ур.)',
      badge: null
    },
    medal: {
      icon: loyalMedalIcon,
      title: 'Орден волка',
      description: 'Повышает титул советника до Старшего батыра (250ур.)',
      badge: null
    }
  },
  lvl300: {
    main: lvl300,
    seal: {
      icon: closeSealIcon,
      title: 'Печать медведя',
      description: 'Повышает титул советника до Великого батыра (300ур.)',
      badge: null
    },
    tally: {
      icon: closeTallyIcon,
      title: 'Знак медведя',
      description: 'Повышает титул советника до Великого батыра (300ур.)',
      badge: null
    },
    medal: {
      icon: closeMedalIcon,
      title: 'Орден медведя',
      description: 'Повышает титул советника до Великого батыра (300ур.)',
      badge: null
    }
  },
  lvl350: {
    main: lvl350,
    seal: {
      icon: highSealIcon,
      title: 'Печать тигра',
      description: 'Повышает титул советника до Мастера батыра (350ур.)',
      badge: null
    },
    tally: {
      icon: highTallyIcon,
      title: 'Знак тигра',
      description: 'Повышает титул советника до Мастера батыра (350ур.)',
      badge: null
    },
    medal: {
      icon: highMedalIcon,
      title: 'Орден тигра',
      description: 'Повышает титул советника до Мастера батыра (350ур.)',
      badge: null
    }
  },
  lvl400: {
    main: lvl400,
    seal: {
      icon: greatSealIcon,
      title: 'Печать орла',
      description: 'Повышает титул советника до Ханского батыра (400ур.)',
      badge: null
    },
    tally: {
      icon: greatTallyIcon,
      title: 'Знак орла',
      description: 'Повышает титул советника до Ханского батыра (400ур.)',
      badge: null
    },
    medal: {
      icon: greatMedalIcon,
      title: 'Орден орла',
      description: 'Повышает титул советника до Ханского батыра (400ур.)',
      badge: null
    }
  },
})

onMounted(() => {
  lvl.value.lvl400.seal.badge = 1
  lvl.value.lvl400.tally.badge = 1
  lvl.value.lvl400.medal.badge = 1
  updateFromSource('lvl400', 'seal')
  updateFromSource('lvl400', 'tally')
  updateFromSource('lvl400', 'medal')
})

const dialog = ref(false);
const currentId = ref(null);
const currentType = ref(null);

const openDialog = (id, type) => {
  dialog.value = true;
  currentId.value = id;
  currentType.value = type;
};

const handleOnFocus = (e) => {
  e.target.select();
  e.target.name = 'tmp_' + Date.now();
};

// Коэффициенты между уровнями для разных типов
const multipliers = {
  'l150-l200': 3,
  'l200-l250': 3,
  'l250-l300': 4,
  'l300-l350': 5,
  'l350-l400': 6
};

// Порядок уровней для вычислений
const levels = ['lvl150', 'lvl200', 'lvl250', 'lvl300', 'lvl350', 'lvl400'];

function updateFromSource(id, type) {
  console.log('Updating from:', id, type);

  const sourceValue = lvl.value[id][type].badge;
  console.log('Source value:', sourceValue);

  if (sourceValue === null || sourceValue === undefined) return;

  const sourceIndex = levels.indexOf(id);

  console.log('Source index:', sourceIndex);

  // Сначала устанавливаем исходное значение
  lvl.value[id][type].badge = sourceValue;

  // Пересчитываем все остальные уровни
  levels.forEach((level, targetIndex) => {
    if (level === id) return; // Пропускаем исходный уровень

    let value = sourceValue;
    console.log(`Calculating ${level} from ${id}:`);

    if (targetIndex < sourceIndex) {
      // Движемся ВВЕРХ к меньшим уровням (lvl150, lvl200) - нужно УМНОЖАТЬ
      // Например, из lvl300 в lvl250: value * 4
      console.log('Moving UP - multiplying');
      for (let i = sourceIndex - 1; i >= targetIndex; i--) {
        const from = levels[i];
        const to = levels[i + 1];
        const multKey = `${from.replace('lvl', 'l')}-${to.replace('lvl', 'l')}`;
        const multiplier = multipliers[multKey];
        console.log(`  ${from} -> ${to}: * ${multiplier}`);
        value *= multiplier;
      }
    } else {
      // Движемся ВНИЗ к большим уровням (lvl350, lvl400) - нужно ДЕЛИТЬ
      // Например, из lvl250 в lvl300: value / 4
      console.log('Moving DOWN - dividing');
      for (let i = sourceIndex; i < targetIndex; i++) {
        const from = levels[i];
        const to = levels[i + 1];
        const multKey = `${from.replace('lvl', 'l')}-${to.replace('lvl', 'l')}`;
        const multiplier = multipliers[multKey];
        console.log(`  ${from} -> ${to}: / ${multiplier}`);
        value /= multiplier;
      }
    }

    const finalValue = Math.floor(value);
    console.log(`Final value for ${level}:`, finalValue);

    lvl.value[level][type].badge = finalValue;
  });

  console.log('Update complete');
}

const addItems = [
  {
    icon: newBox,
    bg: blue,
    title: 'Набор шакала',
    description: 'Все предметы для титула "Батыр".'
  },
  {
    icon: newBoxRandom,
    bg: blue,
    title: 'Случайный набор шакала',
    description: 'Случайное получение 1 из: печать пса, знак шакала, орден шакала.'
  },
  {
    icon: trustedBox,
    bg: violet,
    title: 'Набор кабана',
    description: 'Все предметы для титула "Младший батыр".'
  },
  {
    icon: loyalBox,
    bg: orange,
    title: 'Набор волка',
    description: 'Все предметы для титула "Старший батыр".'
  },
  {
    icon: closeBox,
    bg: red,
    title: 'Набор медведя',
    description: 'Все предметы для титула "Великий батыр".'
  },
  {
    icon: highBox,
    bg: red,
    title: 'Набор тигра',
    description: 'Все предметы для титула "Мастер батыр".'
  },
  {
    icon: greatBox,
    bg: red,
    title: 'Набор орла',
    description: 'Все предметы для титула "Ханский батыр".'
  },
]

</script>

<template>

  <v-card>
    <v-card-text>
      <v-card-subtitle class="text-wrap mb-3">
        Нажмите на любой предмет, чтобы изменить его количество — остальные пересчитаются автоматически.
      </v-card-subtitle>
      <div v-for="(item, id) in lvl">
        <GokIcon :src="item.main" :size="60"/>
        <GokIcon :icon="item.seal.icon" :badge="item.seal.badge" :size="60" @click.prevent="openDialog(id, 'seal')"/>
        <GokIcon :icon="item.tally.icon" :badge="item.tally.badge" :size="60" @click.prevent="openDialog(id, 'tally')"/>
        <GokIcon :icon="item.medal.icon" :badge="item.medal.badge" :size="60" @click.prevent="openDialog(id, 'medal')"/>
      </div>
    </v-card-text>
  </v-card>

  <v-card class="mt-5" title="Вспомогательные предметы">
    <v-card-subtitle class="text-wrap">
      Кликнув на каждый элемент - появится информация о нём
    </v-card-subtitle>
    <v-card-text>

      <v-tooltip
        v-for="(item, i) in addItems"
        :key="i"
        :open-on-hover="false"
        open-on-click
        :close-on-content-click="true"
        location="center"
      >
        <template v-slot:activator="{ props }">
          <GokIcon
            v-bind="props"
            :src="item.icon"
            :size="80"
            :bg="item.bg">
          </GokIcon>
        </template>
        <div class="font-weight-bold">{{ item.title }}</div>
        <div>{{ item.description }}</div>
      </v-tooltip>


    </v-card-text>
  </v-card>

  <v-dialog
    v-model="dialog"
    width="auto"
  >
    <v-card
      max-width="400"
      :title="lvl[currentId][currentType].title || ''"
    >
      <template #subtitle>
        <span v-if="lvl[currentId][currentType].description"
              class="text-wrap">{{ lvl[currentId][currentType].description }}</span>
      </template>
      <template #text>
        <v-text-field
          v-model="lvl[currentId][currentType].badge"
          @update:model-value="updateFromSource(currentId, currentType)"
          label="Кол-во"
          type="number"
          hide-spin-buttons
          @focus="handleOnFocus"
          @keydown.enter="dialog = false"
        >
          <template #append-inner>
            <GokIcon :icon="lvl[currentId][currentType].icon" :size="48"/>
          </template>
        </v-text-field>
      </template>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="Ok"
          @click="dialog = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
