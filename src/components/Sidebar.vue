<script setup>
import {routes} from 'vue-router/auto-routes';

const calcRoutes = routes.filter(route => route.meta?.sidebar && route.meta?.groups?.includes('calc'));
const cheatsheetsRoutes = routes.filter(route => route.meta?.sidebar && route.meta?.groups?.includes('cheatsheet'));

</script>

<template>
  <v-list>
    <v-list-subheader>РАСЧЕТЫ</v-list-subheader>
    <v-list-item
      v-for="route in calcRoutes"
      :key="route.path"
      :to="{name: route.name}"
      :prepend-avatar="route.meta?.icon"
    >
      {{ route.meta?.title || route.name }}
    </v-list-item>
    <v-list-subheader>ШПАРГАЛКИ</v-list-subheader>
    <v-list-item
      v-for="route in cheatsheetsRoutes"
      :key="route.path"
      :to="{name: route.name}"
      :prepend-avatar="route.meta?.icon"
    >
      {{ route.meta?.title || route.name }}
    </v-list-item>
  </v-list>
</template>

<style scoped lang="sass">

</style>
