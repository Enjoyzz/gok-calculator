<script setup>
import { useDisplay, useTheme } from 'vuetify'
import {useAppStore} from "@/stores/app.js";
const appStore = useAppStore()

const drawer = shallowRef(null)
const {mobile} = useDisplay();
const theme = useTheme();


const { theme: currentTheme } = storeToRefs(appStore)

const toggleTheme = () => {
  appStore.toggleTheme();
};

watch(
  () => appStore.theme,
  (newTheme) => {
    theme.change(newTheme)
  },
  { immediate: true }
);

const toggleDrawer = () => drawer.value = !drawer.value

</script>
<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar :elevation="2">
      <v-app-bar-title>
        Game of Khans
      </v-app-bar-title>
      <template v-slot:prepend v-if="mobile">
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <v-btn icon @click="toggleTheme">
          <v-icon v-if="currentTheme === 'dark'">mdi-weather-sunny</v-icon>
          <v-icon v-else>mdi-weather-night</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      :model-value="drawer"
      @update:model-value="toggleDrawer"
      theme="dark" >
      <Sidebar />
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center">
      <v-container>
        <v-sheet rounded="lg" width="100%">
          <v-sheet>
            <v-card-title>
              {{ $route.meta.extendedTitle ||  $route.meta.title || $route.name}}
            </v-card-title>
          </v-sheet>
          <router-view></router-view>
        </v-sheet>
      </v-container>
    </v-main>
  </v-layout>
</template>

<style scoped>

</style>
