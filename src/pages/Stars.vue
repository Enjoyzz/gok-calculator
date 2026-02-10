<script setup>
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
</script>

<template>
  <ScrollsForStarTable/>
  <CalcUniScrolls />
</template>

<style scoped lang="sass">

</style>
