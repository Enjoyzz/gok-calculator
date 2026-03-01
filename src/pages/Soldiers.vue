<script setup>
import soldiersGenIcon from '@/assets/img/icon/1-4.png'
import {useHead} from "@unhead/vue";

definePage({
  path: '/warriors',
  alias: '/soldiers',
  name: 'Soldiers',
  meta: {
    title: 'Солдаты',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор солдат',
    icon: soldiersGenIcon,
  },
});

const title = 'Калькулятор солдат в игре Game of Khans'
const description = 'Расчет солдат в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: soldiersGenIcon},
  ]
})
</script>

<template>
  <SoldiersCalculator/>
</template>

<style scoped lang="sass">

</style>
