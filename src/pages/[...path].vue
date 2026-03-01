<script setup>
import {useHead} from "@unhead/vue";

definePage({
  name: '404',
  meta: {
    layout: 'empty-state',
  },
});


useHead({
  title: '404 Page Not Found',
  meta: [
    {name: 'description', content: false},
    {property: 'og:description', content: false},
    {property: 'og:title', content: false},
    {property: 'og:image', content: false},
    {property: 'og:image:type', content: false},
  ]
})
</script>

<template>
  <NotFound class="mx-auto"/>
</template>
