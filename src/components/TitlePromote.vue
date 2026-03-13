<script setup>
import {useDisplay} from 'vuetify'
import {
  closeMedalIcon, closeSealIcon, closeTallyIcon,
  greatMedalIcon, greatSealIcon, greatTallyIcon, highMedalIcon, highSealIcon, highTallyIcon, loyalMedalIcon,
  loyalSealIcon,
  loyalTallyIcon,
  newMedalIcon,
  newSealIcon,
  newTallyIcon, trustedMedalIcon,
  trustedSealIcon,
  trustedTallyIcon
} from "@/config/gok-item-icon-set.js";
import lvl150 from '@/assets/title/spt_102_102.png';
import lvl200 from '@/assets/title/spt_102_103.png';
import lvl250 from '@/assets/title/spt_102_104.png';
import lvl300 from '@/assets/title/spt_102_105.png';
import lvl350 from '@/assets/title/spt_102_106.png';
import lvl400 from '@/assets/title/spt_102_107.png';

const {smAndDown} = useDisplay()

</script>

<template>

  <v-card>
    <v-card-text>
      <div>
        <GokIcon :src="lvl150" size="60"/>
        <GokIcon :icon="newSealIcon" size="60"/>
        <GokIcon :icon="newTallyIcon" size="60"/>
        <GokIcon :icon="newMedalIcon" size="60"/>
      </div>

      <div>
        <GokIcon :src="lvl200" size="60"/>
        <GokIcon :icon="trustedSealIcon" size="60"/>
        <GokIcon :icon="trustedTallyIcon" size="60"/>
        <GokIcon :icon="trustedMedalIcon" size="60"/>
      </div>

      <div>
        <GokIcon :src="lvl250" size="60"/>
        <GokIcon :icon="loyalSealIcon" size="60"/>
        <GokIcon :icon="loyalTallyIcon" size="60"/>
        <GokIcon :icon="loyalMedalIcon" size="60"/>
      </div>

      <div>
        <GokIcon :src="lvl300" size="60"/>
        <GokIcon :icon="closeSealIcon" size="60"/>
        <GokIcon :icon="closeTallyIcon" size="60"/>
        <GokIcon :icon="closeMedalIcon" size="60"/>
      </div>

      <div>
        <GokIcon :src="lvl350" size="60"/>
        <GokIcon :icon="highSealIcon" size="60"/>
        <GokIcon :icon="highTallyIcon" size="60"/>
        <GokIcon :icon="highMedalIcon" size="60"/>
      </div>

      <div>
        <GokIcon :src="lvl400" size="60"/>
        <GokIcon :icon="greatSealIcon" size="60"/>
        <GokIcon :icon="greatTallyIcon" size="60"/>
        <GokIcon :icon="greatMedalIcon" size="60"/>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="sass">

</style>
