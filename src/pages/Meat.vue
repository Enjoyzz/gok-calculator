<script setup>
import meatGenIcon from '@/assets/img/icon/1-3.png';
import {useHead} from "@unhead/vue";

definePage({
  path: '/meat',
  name: 'Meat',
  meta: {
    title: 'Мясо',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор мяса',
    icon: meatGenIcon,
  },
});

const title = 'Калькулятор мяса в игре Game of Khans'
const description = 'Расчет мяса в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: meatGenIcon},
  ]
})

</script>

<template>
  <MeatCalculator/>
</template>

<style scoped lang="sass">

</style>
