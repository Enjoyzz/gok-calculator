<script setup>
import {useDisplay, useTheme} from 'vuetify';
import {useAppStore} from '@/stores/app.js';
import IconThemeLightDark from '~icons/mdi/theme-light-dark'
import IconWeatherSunny from '~icons/mdi/weather-sunny'
import IconWeatherNight from '~icons/mdi/weather-night'

const appStore = useAppStore();

const drawer = shallowRef(null);
const {mobile} = useDisplay();
const theme = useTheme();

const changeTheme = (themeValue) => {
  appStore.setTheme(themeValue);
};

const isDarkTheme = ref(null);

watch(theme.current, () => {
  isDarkTheme.value = theme.current.value.dark === true;
}, {immediate: true});

watch(
  () => appStore.theme,
  (newTheme) => {
    theme.change(newTheme);
  },
  {immediate: true},
);

const toggleDrawer = () => drawer.value = !drawer.value;

</script>
<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar :elevation="2" :color="isDarkTheme ? 'blue-grey-darken-4' : 'blue-grey-lighten-5'">
      <template #title>
        <router-link :to="{name: 'Index'}">
          <v-img src="/gok.png" alt="Game of Khans" width="150"/>
        </router-link>
      </template>
      <template v-slot:prepend v-if="mobile">
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <v-btn icon class="text-h6">
          <i-mdi-theme-light-dark />

          <v-menu activator="parent">
            <v-list density="compact" prepend-gap="10">
              <v-list-item :prepend-icon="IconThemeLightDark" title="Системная" subtitle="Auto"  @click="changeTheme('system')"/>
              <v-list-item :prepend-icon="IconWeatherSunny" title="Светлая"  subtitle="Light" @click="changeTheme('light')" />
              <v-list-item :prepend-icon="IconWeatherNight" title="Темная" subtitle="Dark"  @click="changeTheme('dark')" />
            </v-list>
          </v-menu>

        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      :model-value="drawer"
      @update:model-value="toggleDrawer"
      :color="isDarkTheme ? 'blue-grey-darken-4' : 'blue-grey-lighten-5'"
    >
      <Sidebar/>
      <template v-slot:append>
        <VersionInfo
          :class="isDarkTheme ? 'text-blue-grey-lighten-1' : 'text-blue-grey-darken-1'"
          class="ma-2"
          :hideInDev="false"
        />
      </template>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center">
      <v-container>
        <v-sheet rounded="lg" width="100%">
          <v-sheet>
            <v-card-title >
<!--              <v-avatar :image="$route.meta?.icon" />-->
              {{ $route.meta.extendedTitle || $route.meta.title || $route.name }}
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
