<script setup>
import {routes} from 'vue-router/auto-routes';

const calcRoutes = routes.filter(route => route.meta?.sidebar && route.meta?.groups?.includes('calc'));
const resourceRoutes = routes.filter(route => route.meta?.sidebar && route.meta?.groups?.includes('resource'));

</script>

<template>
  <v-list>
    <v-list-subheader>РАСЧЕТЫ</v-list-subheader>
    <v-list-item v-for="route in calcRoutes" :key="route.path" :to="{name: route.name}">
      {{ route.meta?.title || route.name }}
    </v-list-item>
    <v-list-subheader>РЕСУРСЫ</v-list-subheader>
    <v-list-item v-for="route in resourceRoutes" :key="route.path" :to="{name: route.name}">
      {{ route.meta?.title || route.name }}
    </v-list-item>
  </v-list>
</template>

<style scoped lang="sass">

</style>
