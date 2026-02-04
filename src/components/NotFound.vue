<script setup>
import router from '@/router/index.js';
</script>
<template>
  <v-empty-state
    headline="Whoops"
    text="Извините, но страница, которую вы ищете не существует, или была удалена, или имя изменено, или временно недоступна."
    title="404 Page Not Found"
  >
    <template v-slot:media>
      <v-img src="/gok.png" />
    </template>
    <template v-slot:actions>
      <div class="text-center">
        <v-btn
          variant="flat"
          rounded="lg"
          :to="{name: 'Index'}"
          text="Перейти на главную"
        ></v-btn>

        <v-btn
          rounded="lg"
          text="Вернуться назад"
          variant="text"
          @click="router.back()"
        ></v-btn>
      </div>
    </template>
  </v-empty-state>
</template>
