<script setup>
import {useHead} from '@unhead/vue'
import tigerIcon from '@/assets/tigers/spt_501_23.png';
import AmalImg from "@/assets/hero/100_412.png";


definePage({
  path: '/tigers',
  name: 'Тигры',
  meta: {
    title: 'Тигры',
    sidebar: true,
    groups: ['cheatsheet'],
    icon: tigerIcon,
  },
});

const title = 'Таблица знаков тигра в игре Game of Khans'
const description = 'Таблица личных знаков тигра для повышения уровня советника на алтаре в игре Game of Khans'

useHead({
  title: title,
  meta: [
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:image', content: tigerIcon},
  ]
})
</script>

<template>
  <v-item-group class="d-flex align-center">
    <v-item>
      <v-img
        :src="tigerIcon"
        cover
        inline
        width="84"
      >
      </v-img>
    </v-item>
    <v-item>
      <small>
        <span class="font-weight-bold">Личн. Знак Тигра</span>. Используется для повышения уровня Звания и может быть куплен в магазине Знаков Тигра.
      </small>
    </v-item>
  </v-item-group>

  <TigersTable />
</template>

<style scoped lang="sass">

</style>
