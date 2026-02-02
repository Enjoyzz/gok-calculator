<script setup>
defineProps(['total'])
</script>

<template>
  <v-bottom-navigation>
    <v-card elevation="0" class="text-center flex-grow-1" density="compact" color="transparent" subtitle="Итого">
      <template #title>
        {{total}}
      </template>
    </v-card>

    <v-btn class="">
      <v-icon icon="mdi-cog"/>
    </v-btn>

  </v-bottom-navigation>
</template>

<style scoped lang="sass">

</style>
