<script setup>
import perfumeIcon from '@/assets/img/icon/2-4211.png';

definePage({
  path: '/charm',
  name: 'Charm',
  meta: {
    title: 'Обаяние',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор обаяния',
    icon: perfumeIcon,
  },
});

</script>

<template>
  <CharmCalculator/>
</template>
