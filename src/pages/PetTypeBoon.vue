<script setup>
import petTypeBoonIcon from '@/assets/img/icon/spt_505_20.png';
import {useHead} from "@unhead/vue";

definePage({
  path: '/pet-type-boon',
  name: 'PetTypeBoon',
  meta: {
    title: 'Процветание',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор рейтинга процветания',
    icon: petTypeBoonIcon,
    order: 70,
  },
});

const title = 'Калькулятор рейтинга процветания в игре Game of Khans'
const description = 'Расчет рейтинга процветания в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: petTypeBoonIcon},
  ]
})

</script>

<template>
  <PetTypeBoonCalculator/>
</template>

<style scoped lang="sass">

</style>
