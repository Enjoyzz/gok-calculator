<script setup>
import {ref} from 'vue'
import {useDisplay} from 'vuetify'
import SubImg from "@/assets/hero/100_314.png";
import JelImg from "@/assets/hero/100_311.png";
import HubImg from "@/assets/hero/100_312.png";
import NokImg from "@/assets/hero/100_313.png";


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

  // Уровни 21-40
  for (let i = 21; i <= 40; i++) {
    levels.push({
      lvl: i,
      tokens: ((i - 20) * 5) + 20,
    });
  }

  return levels;
})

const items = ref([
  {src: HubImg},
  {src: SubImg},
  {src: JelImg},
  {src: NokImg},
])
const selection = ref([0, 1, 2, 3])

const groupBonus = computed(() => {
  return selection.value.length * 5;
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
            Варвары
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
        <v-item-group
          v-model="selection"
          multiple
          class="d-flex align-center"
        >
          <v-item v-for="(item, i) in items"
                  :key="i"
                  v-slot="{ isSelected, toggle }">
            <v-img
              :src="item.src"
              cover
              inline
              width="64"
              @click="toggle"
            >
              <i-mdi-check-circle v-if="isSelected"/>
            </v-img>
          </v-item>

          <v-item>
            <span v-if="groupBonus > 0" class="ps-3 text-h6">+{{ groupBonus }}%</span>
          </v-item>

        </v-item-group>
        <HarmonyTable :levels="allLevels" :groupBonus="groupBonus" :bonusPerLevel="3"/>
      </v-card-text>

    </v-card>

  </v-dialog>


</template>

<style scoped lang="sass">

</style>
