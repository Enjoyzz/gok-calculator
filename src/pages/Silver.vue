<script setup>
import silverGenIcon from '@/assets/img/icon/1-2.png'
import SilverCalculator from '@/components/SilverCalculator.vue';

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
</script>

<template>
  <SilverCalculator />
</template>

<style scoped lang="sass">

</style>
