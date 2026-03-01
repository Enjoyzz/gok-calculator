<script setup>
import perfumeIcon from '@/assets/img/icon/2-4211.png';
import {useHead} from "@unhead/vue";

definePage({
  path: '/charm',
  name: 'Charm',
  meta: {
    title: 'Обаяние',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор обаяния',
    icon: perfumeIcon,
  },
});

const title = 'Калькулятор обаяния в игре Game of Khans'
const description = 'Расчет обаяния в игре Game of Khans'

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
  <CharmCalculator/>
</template>
