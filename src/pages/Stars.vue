<script setup>
import str199 from "@/assets/stars/199.png";
import str101 from "@/assets/stars/101.png";
import str102 from "@/assets/stars/102.png";
import str103 from "@/assets/stars/103.png";
import str104 from "@/assets/stars/104.png";
import str105 from "@/assets/stars/105.png";
import str1000 from "@/assets/stars/1000.png";
import str1001 from "@/assets/stars/1001.png";
import str1002 from "@/assets/stars/1002.png";
import str1003 from "@/assets/stars/1003.png";
import str1004 from "@/assets/stars/1004.png";
import str1005 from "@/assets/stars/1005.png";

definePage({
  path: '/stars',
  name: 'Звезды',
  meta: {
    title: 'Звезды',
    sidebar: true,
    groups: ['cheatsheet'],
  },
});
</script>

<template>
<div class="d-flex">
  <div>
    <GokIcon :src="str199"/>
    <GokIcon :src="str101"/>
    <GokIcon :src="str102"/>
    <GokIcon :src="str103"/>
    <GokIcon :src="str104"/>
    <GokIcon :src="str105"/>
  </div>
  <div>
    <GokIcon :src="str1000" :size="32"/>
    <GokIcon :src="str1001" :size="32"/>
    <GokIcon :src="str1002" :size="32"/>
    <GokIcon :src="str1003" :size="32"/>
    <GokIcon :src="str1004" :size="32"/>
    <GokIcon :src="str1005" :size="32"/>
  </div>
</div>


</template>

<style scoped lang="sass">

</style>
