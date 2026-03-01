<script setup>
import silverGenIcon from '@/assets/img/icon/1-2.png'
import SilverCalculator from '@/components/SilverCalculator.vue';
import {useHead} from "@unhead/vue";

definePage({
  path: '/silver',
  name: 'Silver',
  meta: {
    title: 'Серебро',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор серебра',
    icon: silverGenIcon,
  },
});

const title = 'Калькулятор серебра в игре Game of Khans'
const description = 'Расчет серебра в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: silverGenIcon},
  ]
})
</script>

<template>
  <SilverCalculator/>
</template>

<style scoped lang="sass">

</style>
