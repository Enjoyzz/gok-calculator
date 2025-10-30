<script setup>
import { ref } from 'vue'
import CharmTab from './CharmTab.vue'
import IntimacyTab from './IntimacyTab.vue'

defineProps({
  concubines: Number,
  items: Object,
  formulaSettings: Object
})

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
        :items="items"
        :formulas="formulaSettings.charm"
        :concubines="concubines"
        @update-items="$emit('update-calculator-items', $event)"
    />

    <IntimacyTab
        v-if="activeTab === 'intimacy'"
        :items="items"
        :formulas="formulaSettings.intimacy"
        :concubines="concubines"
        @update-items="$emit('update-calculator-items', $event)"
    />
  </div>
</template>

<style scoped>

</style>