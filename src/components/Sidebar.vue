<script setup>
import {routes} from "vue-router/auto-routes";
</script>

<template>
  <v-list>
    <v-list-item v-for="route in routes" :key="route" :to="{name: route.name}">
      {{ route.meta?.title || route.name }}
    </v-list-item>
  </v-list>
</template>

<style scoped lang="sass">

</style>
