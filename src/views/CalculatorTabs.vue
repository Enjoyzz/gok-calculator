<script setup>
import { ref } from 'vue'
import CharmTab from './CharmTab.vue'
import IntimacyTab from './IntimacyTab.vue'

defineEmits(['update-calculator-items'])

const activeTab = ref('charm')
</script>

<template>
  <div class="calculator">
    <div class="tabs">
      <div
          class="tab"
          :class="{ active: activeTab === 'charm' }"
          @click="activeTab = 'charm'"
      >
        Обаяние
      </div>
      <div
          class="tab"
          :class="{ active: activeTab === 'intimacy' }"
          @click="activeTab = 'intimacy'"
      >
        Близость
      </div>
    </div>

    <CharmTab
        v-if="activeTab === 'charm'"
        @update-items="$emit('update-calculator-items', $event)"
    />

    <IntimacyTab
        v-if="activeTab === 'intimacy'"
        @update-items="$emit('update-calculator-items', $event)"
    />
  </div>
</template>

<style scoped>

</style>