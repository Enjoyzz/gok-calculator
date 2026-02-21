<script setup>
import {ref} from 'vue'
import steppeQueensInsigniaSrc from "@/assets/harmony/2-4301.png";

definePage({
  path: '/harmony',
  name: 'Harmony',
  meta: {
    title: 'Гармония',
    sidebar: true,
    groups: ['cheatsheet'],
    extendedTitle: '"Гармошка" советников',
    icon: steppeQueensInsigniaSrc
  },
});

const wolvesOfWarsHarmony = ref(false)
const warmaidenHarmony = ref(false)
</script>

<template>

  <v-list>
    <v-list-item link @click="wolvesOfWarsHarmony = true"> Варвары (Суб, Хуб, Нок, ...)</v-list-item>
    <v-list-item link @click="warmaidenHarmony = true">Воительницы</v-list-item>
    <v-list-item>Дочери вечности</v-list-item>
    <v-list-item>Марко Поло</v-list-item>
    <v-list-item>Кен</v-list-item>
    <v-list-item>Томоэ Годзэн</v-list-item>
    <v-list-item>Вилма</v-list-item>
    <v-list-item>Джаянти</v-list-item>
    <v-list-item>Сноу</v-list-item>
    <v-list-item>Атилла</v-list-item>
  </v-list>

  <WolvesOfWarsHarmony v-if="wolvesOfWarsHarmony" @close-dialog="wolvesOfWarsHarmony = false"/>
  <WarmaidenHarmony v-if="warmaidenHarmony" @close-dialog="warmaidenHarmony = false"/>

</template>

<style scoped lang="sass">

</style>
