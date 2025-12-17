<template>
  <div v-if="visible" id="saveIndicator">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String
})
</script>

<style scoped>
  #saveIndicator {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1000;
    pointer-events: none;
  }
</style>