<script setup>
import {useHead} from '@unhead/vue'
import icon from '@/assets/title/2-4061.png';
import TitlePromote from "@/components/TitlePromote.vue";


definePage({
  path: '/title',
  name: 'Титул',
  meta: {
    title: 'Титул',
    sidebar: true,
    groups: ['cheatsheet'],
    icon: icon,
  },
});

const title = 'Титулы советникам в игре Game of Khans'
const description = 'Титулы советникам  в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: icon},
  ]
})
</script>

<template>
  <TitlePromote />
</template>

<style scoped lang="sass">

</style>
