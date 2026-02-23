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
import WolvesOfWarsHarmony from "@/components/harmony/WolvesOfWarsHarmony.vue";
import SteppeQueensHarmony from "@/components/harmony/SteppeQueensHarmony.vue";
import WarmaidenHarmony from "@/components/harmony/WarmaidenHarmony.vue";
import MarkoPoloHarmony from "@/components/harmony/MarkoPoloHarmony.vue";
import KenHarmony from "@/components/harmony/KenHarmony.vue";
import TomoeHarmony from "@/components/harmony/TomoeHarmony.vue";
import AtillaHarmony from "@/components/harmony/AtillaHarmony.vue";
import AmalHarmony from "@/components/harmony/AmalHarmony.vue";
import SnowHarmony from "@/components/harmony/SnowHarmony.vue";
import JayantiHarmony from "@/components/harmony/JayantiHarmony.vue";
import VilmaHarmony from "@/components/harmony/VilmaHarmony.vue";

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

const wolvesOfWars = ref(false)
const warmaiden = ref(false)
const steppeQueens = ref(false)
const marco = ref(false)
const ken = ref(false)
const tomoe = ref(false)
const atilla = ref(false)
const amal = ref(false)
const vilma = ref(false)
const jayanti = ref(false)
const snow = ref(false)

</script>

<template>

  <v-list lines="two">
    <v-list-item :prepend-avatar="SubImg" link @click="wolvesOfWars = true"> Варвары (Суб, Джэл, Хуб, Нок)</v-list-item>
    <v-list-item :prepend-avatar="TomirisImg" link @click="steppeQueens = true">Воительницы (Томирис, Хутулун, Алтана, Минбалла, Нара)</v-list-item>
    <v-list-item :prepend-avatar="AnarImg" link @click="warmaiden = true">Дочери вечности (Анар, Земея, Айрис, Иветт)</v-list-item>
    <v-list-item :prepend-avatar="MarkoPoloImg" link @click="marco = true">Марко Поло</v-list-item>
    <v-list-item :prepend-avatar="KenImg" link @click="ken = true">Кен Арок</v-list-item>
    <v-list-item :prepend-avatar="TomoeImg" link @click="tomoe = true">Томоэ Годзэн</v-list-item>
    <v-list-item :prepend-avatar="AmalImg" link @click="amal = true" class="text-muted">Амар</v-list-item>
    <v-list-item :prepend-avatar="VilmaImg" link @click="vilma = true">Вилма</v-list-item>
    <v-list-item :prepend-avatar="JayantiImg" link @click="jayanti = true">Джаянти</v-list-item>
    <v-list-item :prepend-avatar="SnowImg" link @click="snow = true">Сноу</v-list-item>
    <v-list-item :prepend-avatar="AtillaImg" link @click="atilla = true">Атилла</v-list-item>
  </v-list>

  <WolvesOfWarsHarmony
    v-if="wolvesOfWars"
    @close-dialog="wolvesOfWars = false"
  />
  <SteppeQueensHarmony
    v-if="steppeQueens"
    @close-dialog="steppeQueens = false"
  />

  <WarmaidenHarmony
    v-if="warmaiden"
    @close-dialog="warmaiden = false"
  />

  <MarkoPoloHarmony
    v-if="marco"
    @close-dialog="marco = false"
  />

  <KenHarmony
    v-if="ken"
    @close-dialog="ken = false"
  />

  <TomoeHarmony
    v-if="tomoe"
    @close-dialog="tomoe = false"
  />

  <AtillaHarmony
    v-if="atilla"
    @close-dialog="atilla = false"
  />

  <AmalHarmony
    v-if="amal"
    @close-dialog="amal = false"
  />

  <SnowHarmony
    v-if="snow"
    @close-dialog="snow = false"
  />

  <JayantiHarmony
    v-if="jayanti"
    @close-dialog="jayanti = false"
  />

  <VilmaHarmony
    v-if="vilma"
    @close-dialog="vilma = false"
  />

</template>

<style scoped lang="sass">

</style>
