<script setup>
import soldiersGenIcon from '@/assets/img/icon/1-4.png'

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
</script>

<template>
  <SoldiersCalculator />
</template>

<style scoped lang="sass">

</style>
