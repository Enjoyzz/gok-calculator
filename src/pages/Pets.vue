<script setup>
import perfumeIcon from '@/assets/img/icon/2-4211.png';
import {useHead} from "@unhead/vue";
import PetsCalc from "@/components/PetsCalc.vue";

definePage({
  path: '/pets',
  name: 'Pets',
  meta: {
    title: 'Питомцы',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор для рейтинга боевых питомцев',
    icon: perfumeIcon,
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
    {property: 'og:image', content: perfumeIcon},
  ]
})

</script>

<template>
  <PetsCalc />
</template>
