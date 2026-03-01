<script setup>
import gemRingIcon from '@/assets/img/icon/2-4221.png';
import {useHead} from "@unhead/vue";

definePage({
  path: '/intimacy',
  name: 'Intimacy',
  meta: {
    title: 'Близость',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор близости',
    icon: gemRingIcon,
  },
});

const title = 'Калькулятор близости в игре Game of Khans'
const description = 'Расчет близости в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: gemRingIcon},
  ]
})

</script>

<template>
  <IntimacyCalculator/>
</template>
