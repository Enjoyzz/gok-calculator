<script setup>
import gemRingIcon from '@/assets/img/icon/2-4221.png';

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
</script>

<template>
  <IntimacyCalculator/>
</template>
