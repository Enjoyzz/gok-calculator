<script setup>
import {routes} from 'vue-router/auto-routes';

const calcRoutes = routes.filter(route => route.meta?.sidebar && route.meta?.groups?.includes('calc'));

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

  </v-list>
</template>

<style scoped lang="sass">

</style>
