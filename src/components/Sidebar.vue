<script setup>
import {routes} from 'vue-router/auto-routes';

const calcRoutes = routes
  .filter(route => route.meta?.sidebar && route.meta?.groups?.includes('calc'))
  .sort((a, b) => {
    const oa = a.meta.order ?? Infinity
    const ob = b.meta.order ?? Infinity
    if (oa !== ob) return oa - ob
    return (a.meta.title ?? '').localeCompare(b.meta.title ?? '', 'ru')
  });

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
