<script setup>
import {ref} from 'vue'
import MarkoPoloImg from "@/assets/hero/100_342.png";

defineEmits([
  'close-dialog'
])

const dialog = ref(true)

</script>

<template>
<v-dialog
  v-model="dialog"
  @afterLeave="$emit('close-dialog')"
  fullscreen
>
  <v-card>
    <v-toolbar>
      <v-btn
        @click="dialog = false"
        icon
      >
        <v-icon>
          <i-mdi-close />
        </v-icon>
      </v-btn>
      <v-toolbar-title>Варвары (гармония)</v-toolbar-title>
    </v-toolbar>

    <v-img :src="MarkoPoloImg" />

    <v-list lines="two">
      <v-list-subheader>User Controls</v-list-subheader>

      <v-list-item
        subtitle="Set the content filtering level to restrict apps that can be downloaded"
        title="Content filtering"
        link
      ></v-list-item>

      <v-list-item
        subtitle="Require password for purchase or use password to restrict purchase"
        title="Password"
        link
      ></v-list-item>


    </v-list>
  </v-card>
</v-dialog>
</template>

<style scoped lang="sass">

</style>
