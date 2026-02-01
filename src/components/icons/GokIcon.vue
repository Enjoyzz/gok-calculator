<script setup>
import bgRed from '@/assets/img/bg/bg-red.png'
import bgOrange from '@/assets/img/bg/bg-orange.png'
import bgViolet from '@/assets/img/bg/bg-violet.png'
import bgBlue from '@/assets/img/bg/bg-blue.png'
import bgGreen from '@/assets/img/bg/bg-green.png'

const props = defineProps(['icon', 'bg', 'name', 'size'])

const bgList = {
  orange: bgOrange,
  red: bgRed,
  violet: bgViolet,
  blue: bgBlue,
  green: bgGreen
}
</script>

<template>
  <div class="icon" :style="{'--icon-size': `${size}px`}">
    <div class="bg" :style="{backgroundImage:  `url(${bgList[bg]})`}">
      <img :src="icon" :alt="name || ''">
    </div>
  </div>
</template>

<style scoped lang="sass">
.icon
  --icon-size: 72px

.bg
  background-repeat: no-repeat
  background-size: cover
  margin: 5px

  &, & img, div.icon
    width: var(--icon-size)
    height: var(--icon-size)
</style>
