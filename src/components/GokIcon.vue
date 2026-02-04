<script setup>
import {useTheme} from 'vuetify/framework';

const theme = useTheme();

const props = defineProps(['icon', 'src', 'bg', 'name', 'size', 'badge']);

const isDarkTheme = ref(null);

watch(theme.current, () => {
  isDarkTheme.value = theme.current.value.dark === true;
}, {immediate: true});

const iconPath = computed(() => {
  return props.icon ? props.icon.src : props.src;
});

const bgValue = computed(() => {
  return props.icon ? props.icon.bg : props.bg;
});

const iconSize = computed(() => {
  return props.size || 72;
});


</script>

<template>
  <div class="icon">
    <div class="bg" :style="{backgroundImage:  `url(${bgValue})`}">
      <img :src="iconPath" :alt="name || ''">
      <div v-if="badge" :class="{'bg-blue-grey-lighten-5': isDarkTheme, 'bg-blue-grey-darken-3': !isDarkTheme}"
           class="badge text-caption  border-thin rounded ">
        {{ badge }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.bg
  position: relative
  background-repeat: no-repeat
  background-size: cover
  margin: 5px

  &, & img, div.icon
    width: v-bind('iconSize + "px"')
    height: v-bind('iconSize + "px"')


.badge
  position: absolute
  bottom: -4px
  right: -4px
  min-width: 20px
  height: 20px
  display: flex
  align-items: center
  justify-content: center
  padding: 0 4px
  box-sizing: border-box
</style>
