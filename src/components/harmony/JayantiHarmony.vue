<script setup>
import {ref} from 'vue'
import {useDisplay} from 'vuetify'
import JayantiImg from "@/assets/hero/100_421.png";
import VilmaImg from "@/assets/hero/100_411.png";

const {smAndDown} = useDisplay()


const emit = defineEmits([
  'close-dialog',
])

const dialog = ref(true)

const allLevels = computed(() => {
  const levels = [];

  // Уровни 1-8
  for (let i = 1; i <= 8; i++) {
    levels.push({
      lvl: i,
      tokens: ((i) * 2) + 4,
    });
  }

  // Уровни 9-20
  for (let i = 9; i <= 20; i++) {
    levels.push({
      lvl: i,
      tokens: 20,
    });
  }

  return levels;
})

</script>

<template>
  <v-dialog
    v-model="dialog"
    @afterLeave="$emit('close-dialog')"
    :fullscreen="smAndDown"
    max-width="500"
    scrollable
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <v-card-title class="my-0 py-0">
            Джаянти
          </v-card-title>
          <v-card-subtitle class="my-0 py-0">
            гармония
          </v-card-subtitle>
        </v-toolbar-title>
        <template #append>
          <v-btn
            @click="dialog = false"
            icon
          >
            <v-icon>
              <i-mdi-close/>
            </v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-item-group class="d-flex align-center">
          <v-item>
            <v-img
              :src="JayantiImg"
              cover
              inline
              width="84"
            >
            </v-img>
          </v-item>
          <v-item>
            <small>
              <span class="font-weight-bold">Гордое величие</span>. В событии "Ледовое побоище" сила Джаянти увеличивается на 20%, а численность воинов на 10%.
            </small>
          </v-item>
        </v-item-group>
        <HarmonyTable :levels="allLevels" :bonusPerLevel="12"/>
      </v-card-text>

    </v-card>

  </v-dialog>


</template>

<style scoped lang="sass">

</style>
