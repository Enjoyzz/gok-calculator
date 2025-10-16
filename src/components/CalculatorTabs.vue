<script>
import { ref } from 'vue'
import CharmTab from './CharmTab.vue'
import IntimacyTab from './IntimacyTab.vue'

export default {
  name: 'CalculatorTabs',
  components: {
    CharmTab,
    IntimacyTab
  },
  props: {
    concubines: Number,
    charmItems: Object,
    intimacyItems: Object,
    formulas: Object
  },
  emits: ['update-charm-items', 'update-intimacy-items'],
  setup() {
    const activeTab = ref('charm')

    return {
      activeTab
    }
  }
}
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