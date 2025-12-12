<script setup>
import {inject, ref} from 'vue'
import CharmTab from './CharmTab.vue'
import IntimacyTab from './IntimacyTab.vue'
import {activeTabKey} from "@/data/keys.js";

defineEmits(['update-calculator-items', 'open-setting'])
const activeTab = inject(activeTabKey)

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
        @open-setting="$emit('open-setting', $event)"
    />

    <IntimacyTab
        v-if="activeTab === 'intimacy'"
        @update-items="$emit('update-calculator-items', $event)"
        @open-setting="$emit('open-setting', $event)"
    />
  </div>
</template>

<style scoped>

</style>