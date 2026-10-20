<script setup>
import petIcon from '@/assets/pet/petking/spt_5408_408.png';
import {useHead} from "@unhead/vue";
import PetsCalc from "@/components/PetsCalc.vue";
import PetsReference from "@/components/PetsReference.vue";

definePage({
  path: '/pets',
  name: 'Pets',
  meta: {
    title: 'Питомцы',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор для рейтинга боевых питомцев',
    icon: petIcon,
    order: 40,
  },
});

const title = 'Калькулятор для рейтинга боевых питомцев в игре Game of Khans'
const description = 'Калькулятор для рейтинга боевых питомцев в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: petIcon},
  ]
})
const tab = ref('calc')
</script>

<template>
  <v-tabs v-model="tab" grow>
    <v-tab value="calc">Калькулятор</v-tab>
    <v-tab value="ref">Справочник</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab" class="mt-4">
    <v-tabs-window-item value="calc"><PetsCalc /></v-tabs-window-item>
    <v-tabs-window-item value="ref"><PetsReference /></v-tabs-window-item>
  </v-tabs-window>
</template>
