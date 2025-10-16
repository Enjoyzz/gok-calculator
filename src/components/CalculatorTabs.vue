<script setup>
import { ref } from 'vue'
import CharmTab from './CharmTab.vue'
import IntimacyTab from './IntimacyTab.vue'

defineProps({
  concubines: Number,
  charmItems: Object,
  intimacyItems: Object,
  formulas: Object
})

defineEmits(['update-charm-items', 'update-intimacy-items'])

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
        :items="charmItems"
        :formulas="formulas.charm"
        :concubines="concubines"
        @update-items="$emit('update-charm-items', $event)"
    />

    <IntimacyTab
        v-if="activeTab === 'intimacy'"
        :items="intimacyItems"
        :formulas="formulas.intimacy"
        :concubines="concubines"
        @update-items="$emit('update-intimacy-items', $event)"
    />
  </div>
</template>

<style scoped>

</style>