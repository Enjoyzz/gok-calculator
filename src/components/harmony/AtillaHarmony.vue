<script setup>
import {ref} from 'vue'
import {useDisplay} from 'vuetify'
import AtillaImg from "@/assets/hero/100_321.png";

const {smAndDown} = useDisplay()


const emit = defineEmits([
  'close-dialog',
])

const dialog = ref(true)

const allLevels = computed(() => {
  const levels = [];

  // Уровни 1-5
  for (let i = 1; i <= 5; i++) {
    levels.push({
      lvl: i,
      tokens: ((i) * 2) + 3,
    });
  }

  // Уровни 6-20
  for (let i = 6; i <= 20; i++) {
    levels.push({
      lvl: i,
      tokens: 15,
    });
  }

  // Уровни 21-40
  for (let i = 21; i <= 40; i++) {
    levels.push({
      lvl: i,
      tokens: 20,
    });
  }

  return levels;
})

const groupBonus = ref(30)
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
            Атилла
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
            :src="AtillaImg"
            cover
            inline
            width="84"
          >
          </v-img>
        </v-item>
          <v-item>
            <span v-if="groupBonus > 0" class="ps-3 text-h6">+{{ groupBonus }}%</span>
          </v-item>
        </v-item-group>
        <HarmonyTable :levels="allLevels" :bonusPerLevel="4" :groupBonus="groupBonus"/>
      </v-card-text>

    </v-card>

  </v-dialog>


</template>

<style scoped lang="sass">

</style>
