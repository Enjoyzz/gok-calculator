<script setup>
definePage({
  path: '/charm',
  name: 'Charm',
  meta: {
    title: 'Обаяние',
    sidebar: true,
    groups: ['calc'],
    extendedTitle: 'Калькулятор обаяния',
    layout: 'calculator'
  },
});

</script>

<template>
  <CharmCalculator/>
</template>
