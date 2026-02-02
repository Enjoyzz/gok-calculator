<script setup>
import bgRed from '@/assets/img/bg/bg-red.png'
import bgOrange from '@/assets/img/bg/bg-orange.png'
import bgViolet from '@/assets/img/bg/bg-violet.png'
import bgBlue from '@/assets/img/bg/bg-blue.png'
import bgGreen from '@/assets/img/bg/bg-green.png'

const props = defineProps(['icon', 'src', 'bg', 'name', 'size'])

const iconPath = computed(() => {
  return props.icon ? props.icon.src : props.src
})

const bgValue = computed(() => {
  return bgList[props.icon ? props.icon.bg : props.bg]
})

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
    <div class="bg" :style="{backgroundImage:  `url(${bgValue})`}">
      <img :src="iconPath" :alt="name || ''">
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
