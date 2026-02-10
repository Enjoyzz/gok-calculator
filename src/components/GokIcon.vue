<script setup>
import {useTheme} from 'vuetify/framework';

const theme = useTheme();

const props = defineProps({
  icon: {
    type: Object,
  }, src: {
    type: String,
  }, bg: {
    type: String,
  }, name: {
    type: String,
  }, size: {
    type: [Number],
    default: 72,
  }, badge: {
    type: [String, Number]
  },
});

const isDarkTheme = ref(null);
const validProps = ref(true);

watch(theme.current, () => {
  isDarkTheme.value = theme.current.value.dark === true;
}, {immediate: true});

const iconPath = computed(() => {
  if (!props.icon?.src && !props.src) {
    validProps.value = false
    console.warn('GokIcon component -  need set :icon or :src props. The icon props must be object {src:String, bg:?String}');
  }
  return props.icon ? props.icon.src : props.src;
});

const backgroundStyle = computed(() => {
  const bg =  props.icon ? props.icon.bg : props.bg;
  if (!bg) {
    return {}
  }
  return {
    backgroundImage: `url(${bg})`,

  }
});

const iconSize = computed(() => {
  return props.size !== undefined ? props.size : 72;
});

const iconSizeStyle = computed(() => `${iconSize.value}px`);

</script>

<template>
  <div class="icon" v-if="validProps">
    <div class="bg" :style="backgroundStyle">
      <img :src="iconPath" :alt="name || ''">
      <div v-if="badge" :class="{'bg-blue-grey-lighten-5': isDarkTheme, 'bg-blue-grey-darken-3': !isDarkTheme}"
           class="badge text-caption  border-thin rounded ">
        {{ badge }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.icon
  display: inline-block
.bg
  position: relative
  background-repeat: no-repeat
  background-size: cover
  margin: 5px

  &, & img, div.icon
    width: v-bind('iconSizeStyle')
    height: v-bind('iconSizeStyle')


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
