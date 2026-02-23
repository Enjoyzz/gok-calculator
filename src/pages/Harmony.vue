<script setup>
import {ref} from 'vue'
import steppeQueensInsigniaSrc from "@/assets/harmony/2-4301.png";
import MarkoPoloImg from "@/assets/hero/100_342.png";
import KenImg from "@/assets/hero/100_341.png";
import TomoeImg from "@/assets/hero/100_343.png";
import VilmaImg from "@/assets/hero/100_411.png";
import JayantiImg from "@/assets/hero/100_421.png";
import SnowImg from "@/assets/hero/100_422.png";
import AtillaImg from "@/assets/hero/100_321.png";
import AmalImg from "@/assets/hero/100_412.png";
import SubImg from "@/assets/hero/100_314.png";
import TomirisImg from "@/assets/hero/100_304.png";
import AnarImg from "@/assets/hero/100_401.png";

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
const steppeQueensHarmony = ref(false)
const marcoHarmony = ref(false)
const kenHarmony = ref(false)
const tomoeHarmony = ref(false)

</script>

<template>

  <v-list>
    <v-list-item :prepend-avatar="SubImg" link @click="wolvesOfWarsHarmony = true"> Варвары (Суб, Джэл, Хуб, Нок)</v-list-item>
    <v-list-item :prepend-avatar="TomirisImg" link @click="steppeQueensHarmony = true">Воительницы (Томирис, Хутулун, Алтана, Минбалла, Нара)</v-list-item>
    <v-list-item :prepend-avatar="AnarImg" link @click="warmaidenHarmony = true">Дочери вечности (Анар, Земея, Айрис, Иветт)</v-list-item>
    <v-list-item :prepend-avatar="MarkoPoloImg" link @click="marcoHarmony = true">Марко Поло</v-list-item>
    <v-list-item :prepend-avatar="KenImg" link @click="kenHarmony = true">Кен</v-list-item>
    <v-list-item :prepend-avatar="TomoeImg" link @click="tomoeHarmony = true">Томоэ Годзэн</v-list-item>
    <v-list-item :prepend-avatar="AmalImg">Амар</v-list-item>
    <v-list-item :prepend-avatar="VilmaImg">Вилма</v-list-item>
    <v-list-item :prepend-avatar="JayantiImg">Джаянти</v-list-item>
    <v-list-item :prepend-avatar="SnowImg">Сноу</v-list-item>
    <v-list-item :prepend-avatar="AtillaImg">Атилла</v-list-item>
  </v-list>

  <WolvesOfWarsHarmony
    v-if="wolvesOfWarsHarmony"
    @close-dialog="wolvesOfWarsHarmony = false"
  />
  <SteppeQueensHarmony
    v-if="steppeQueensHarmony"
    @close-dialog="steppeQueensHarmony = false"
  />

  <WarmaidenHarmony
    v-if="warmaidenHarmony"
    @close-dialog="warmaidenHarmony = false"
  />

  <MarkoPoloHarmony
    v-if="marcoHarmony"
    @close-dialog="marcoHarmony = false"
  />

  <KenHarmony
    v-if="kenHarmony"
    @close-dialog="kenHarmony = false"
  />

  <TomoeHarmony
    v-if="tomoeHarmony"
    @close-dialog="tomoeHarmony = false"
  />

</template>

<style scoped lang="sass">

</style>
