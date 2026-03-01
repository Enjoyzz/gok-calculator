<script setup>
import {useHead} from '@unhead/vue'
import str105 from '@/assets/stars/105.png';


definePage({
  path: '/stars',
  name: 'Звезды',
  meta: {
    title: 'Звезды',
    sidebar: true,
    groups: ['cheatsheet'],
    icon: str105,
  },
});

const title = 'Звёзды советникам и расчет универ. свитков в игре Game of Khans'
const description = 'Расчет универсальных свитков и Расчет универсальных свитков в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: str105},
  ]
})
</script>

<template>
  <CalcUniScrolls/>
  <v-divider class="pb-3 mt-5"/>
  <ScrollsForStarTable/>
</template>

<style scoped lang="sass">

</style>
