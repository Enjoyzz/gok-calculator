<script setup>
import {routes} from "vue-router/auto-routes";
</script>

<template>
  <v-app>
    <v-list>
{{console.log(routes)}}
      <v-list-item v-for="route in routes" :key="route" :to="{name: route.name}">
        {{ route.meta?.title || route.name }}
      </v-list-item>
    </v-list>
    <router-view />
  </v-app>
</template>

