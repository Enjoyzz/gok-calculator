<script setup>
import {
  scrollBlueIcon,
  scrollGreenIcon,
  scrollOrangeIcon,
  scrollRedIcon,
  scrollVioletIcon,
  summonSealIcon
} from '@/config/gok-item-icon-set.js';
import {useDisplay} from 'vuetify/framework';
import {formatLargeNumber} from '@/utils/formatNumbers.js';

const dialog = ref(false);
const currentId = ref(null);

const {smAndUp} = useDisplay();

const sizeScroll = computed(() => {
  return 80; //smAndUp.value ? 80 : 48;
});

const openDialog = (id) => {
  dialog.value = true;
  currentId.value = id;
};

const scrollIcons = ref({
  SummonSeal: {
    icon: summonSealIcon,
    title: "Приказ отбора",
    badge: 25,
  },
  scrollGreen: {
    icon: scrollGreenIcon,
    title: "Универ. свиток (Обычный)",
    badge: 360,
  },
  scrollBlue: {
    icon: scrollBlueIcon,
    title: "Универ. свиток (Продвинутый)",
    badge: 120,
  },
  scrollViolet: {
    icon: scrollVioletIcon,
    title: "Универ. свиток (Редкий)",
    badge: 30,
  },
  scrollOrange: {
    icon: scrollOrangeIcon,
    title: "Универ. свиток (Эпичный)",
    badge: 6,
  },
  scrollRed: {
    icon: scrollRedIcon,
    title: "Универ. свиток (Легендарный)",
    badge: 1,
  },
});

const scrollItemsWithFormattedBadges = computed(() => {
  const result = {};

  Object.entries(scrollIcons.value).forEach(([key, item]) => {
    result[key] = {
      ...item,
      badgeFormatted: (key === 'SummonSeal' ? '~' : '')  + formatLargeNumber(item.badge, {removeZero: true}),
    };
  });

  return result;
});

function updateFromSource(color) {
  console.log(color)
  const value = scrollIcons.value[color].badge;

  switch (color) {
    case 'SummonSeal':
      scrollIcons.value.scrollGreen.badge = value * 14;
      scrollIcons.value.scrollBlue.badge = Math.floor(scrollIcons.value.scrollGreen.badge / 3);
      scrollIcons.value.scrollViolet.badge = Math.floor(scrollIcons.value.scrollBlue.badge / 4);
      scrollIcons.value.scrollOrange.badge = Math.floor(scrollIcons.value.scrollViolet.badge / 5);
      scrollIcons.value.scrollRed.badge = Math.floor(scrollIcons.value.scrollOrange.badge / 6);
      break;
    case 'scrollRed':
      scrollIcons.value.scrollOrange.badge = value * 6;
      scrollIcons.value.scrollViolet.badge = value * 6 * 5;
      scrollIcons.value.scrollBlue.badge = value * 6 * 5 * 4;
      scrollIcons.value.scrollGreen.badge = value * 6 * 5 * 4 * 3;
      scrollIcons.value.SummonSeal.badge = Math.floor(scrollIcons.value.scrollGreen.badge / 14);
      break;

    case 'scrollOrange':
      scrollIcons.value.scrollRed.badge = Math.floor(value / 6);
      scrollIcons.value.scrollViolet.badge = value * 5;
      scrollIcons.value.scrollBlue.badge = value * 5 * 4;
      scrollIcons.value.scrollGreen.badge = value * 5 * 4 * 3;
      scrollIcons.value.SummonSeal.badge = Math.floor(scrollIcons.value.scrollGreen.badge / 14);
      break;

    case 'scrollViolet':
      scrollIcons.value.scrollRed.badge = Math.floor(value / (6 * 5));
      scrollIcons.value.scrollOrange.badge = Math.floor(value / 5);
      scrollIcons.value.scrollBlue.badge = value * 4;
      scrollIcons.value.scrollGreen.badge = value * 4 * 3;
      scrollIcons.value.SummonSeal.badge = Math.floor(scrollIcons.value.scrollGreen.badge / 14);
      break;

    case 'scrollBlue':
      scrollIcons.value.scrollRed.badge = Math.floor(value / (6 * 5 * 4));
      scrollIcons.value.scrollOrange.badge = Math.floor(value / (5 * 4));
      scrollIcons.value.scrollViolet.badge = Math.floor(value / 4);
      scrollIcons.value.scrollGreen.badge = value * 3;
      scrollIcons.value.SummonSeal.badge = Math.floor(scrollIcons.value.scrollGreen.badge / 14);
      break;

    case 'scrollGreen':
      scrollIcons.value.scrollRed.badge = Math.floor(value / (6 * 5 * 4 * 3));
      scrollIcons.value.scrollOrange.badge = Math.floor(value / (5 * 4 * 3));
      scrollIcons.value.scrollViolet.badge = Math.floor(value / (4 * 3));
      scrollIcons.value.scrollBlue.badge = Math.floor(value / 3);
      scrollIcons.value.SummonSeal.badge = Math.floor(value / 14);
      break;
  }
}

const handleOnFocus = (e) => {
  e.target.select();
  e.target.name = 'tmp_' + Date.now();
};
</script>

<template>
  <div>
    <v-card-title class="text-wrap">Расчет универсальных свитков</v-card-title>
    <v-card-subtitle class="text-wrap">Кликните на иконку свитка и введите нужное вам количество &mdash; расчитается
      необходимое количество
      свитков грейдом ниже, а также &mdash; сколько из этих свитков выйдет грейдом выше
    </v-card-subtitle>
    <v-spacer class="my-5"/>

    <div :class="{'text-center': !smAndUp}">
      <GokIcon v-for="({icon, badgeFormatted}, id) in scrollItemsWithFormattedBadges"
               :key="id"
               :icon="icon"
               :badge="badgeFormatted"
               :size="sizeScroll"
               class="cursor-pointer"
               @click.prevent="openDialog(id)"/>
    </div>
    <v-spacer class="my-5"/>
    <v-card-subtitle class="text-wrap">По-умолчанию показан расчет на 1 красный свиток</v-card-subtitle>
    <v-card-subtitle class="text-wrap">Количество <strong>приказов отбора</strong> примерное &mdash; &plusmn; 20% (при условии что все "зелёные" и "синие" советники прокачаны на 5 звёзд)</v-card-subtitle>


    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
        :title="scrollIcons[currentId].title"
      >
        <template #text>
          <v-text-field
            v-model="scrollIcons[currentId].badge"
            @update:model-value="updateFromSource(currentId)"
            label="Кол-во"
            type="number"
            hide-spin-buttons
            @focus="handleOnFocus"
            @keydown.enter="dialog = false"
          >
            <template #append-inner>
              <GokIcon :icon="scrollIcons[currentId].icon" :size="48"/>
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
  </div>
</template>

<style scoped lang="sass">

</style>
