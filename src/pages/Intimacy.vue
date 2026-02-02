<script setup>
definePage({
  path: '/intimacy',
  name: 'Intimacy',
  meta: {
    title: 'Близость',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор близости',
    layout: 'calculator'
  },
});
</script>

<template>
  <IntimacyCalculator/>
</template>
