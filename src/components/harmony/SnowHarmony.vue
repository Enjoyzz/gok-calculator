<script setup>
import {ref} from 'vue'
import {useDisplay} from 'vuetify'
import SnowImg from "@/assets/hero/100_422.png";
import {snowInsigniaIcon} from "@/config/gok-item-icon-set.js";

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

const extendLevelInfo = {
  1: 'Открывает образ хана "Сноу"',
  4: 'В битве орд лимит элитных воинов советника Сноу повышен на 25%',
  8: 'В битве орд сила Сноу повышается на 50%'
}

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
            Сноу
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
              :src="SnowImg"
              cover
              inline
              width="84"
            >
            </v-img>
          </v-item>
          <v-item>
            <small>
              <span class="font-weight-bold">Страж тундры</span>. В событии "Битва Орд" сила Сноу увеличивается на 20%,
              а численность воинов на 10%.
            </small>
          </v-item>
        </v-item-group>
        <HarmonyTable
          :levels="allLevels"
          :bonusPerLevel="12"
          :extendLevelInfo="extendLevelInfo"
          :tokenIcon="snowInsigniaIcon"
        />
      </v-card-text>

    </v-card>

  </v-dialog>


</template>

<style scoped lang="sass">

</style>
