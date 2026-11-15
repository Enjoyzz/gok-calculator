<script setup>
import {useHead} from '@unhead/vue'
import RallyCalculator from '@/components/RallyCalculator.vue'

definePage({
  path: '/sync',
  name: 'Sync',
  meta: {
    title: 'Синхронизация сборов',
    sidebar: false,
    groups: ['calc'],
    extendedTitle: 'Калькулятор синхронизации сборов',
    order: 50,
  },
})

const title = 'Калькулятор синхронизации сборов в игре Game of Khans'
const description = 'Расчёт времени запуска сборов, чтобы они пришли в точку одновременно'

useHead({
  title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
  ],
})
</script>

<template>
  <RallyCalculator />
</template>
