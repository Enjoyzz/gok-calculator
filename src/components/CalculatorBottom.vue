<script setup>
import {formatLargeNumber} from '@/utils/formatNumbers.js';

const props = defineProps(['total', 'settings', 'items', 'defaultsSettings']);
const settingDialog = ref(false);
const oldData = ref(null);

const emit = defineEmits(['save-settings']);

const data = ref(
  Object.entries(props.settings).map(([id, value]) => {
    const item = props.items.find(i => i.id === id);
    return {
      ...item,
      value: value,
    };
  }));

const openDialog = function() {
  oldData.value = data.value.map(item => {
    return {
      ...item
    }
  })
  settingDialog.value = true;
}

const closeDialog = function(isConfirm = false) {
  if (isConfirm === true && !confirm('Все изменения не сохранятся') ) {
    settingDialog.value = true;
    return
  }

  data.value = oldData.value.map(item => {
    return {
      ...item
    }
  })

  settingDialog.value = false;
};

const saveSettings = function() {
  emit('save-settings', Object.fromEntries(
    data.value.map(item => [item.id, Number(item.value)]),
  ));

  settingDialog.value = false;
};

const resetValue = function(id) {
  const index = data.value.findIndex(i => i.id === id)
  if (index !== -1) {
    data.value[index].value = props.defaultsSettings[id]
  }
}
</script>

<template>
  <v-bottom-navigation elevation="16">
    <v-card elevation="0" class="text-center flex-grow-1" density="compact" color="transparent" subtitle="Итого">
      <template #title>
        ~&nbsp;{{ formatLargeNumber(total, {removeZero: true}) }}
      </template>
    </v-card>

    <v-btn @click.prevent="openDialog">
      <v-icon icon="mdi-cog"/>
    </v-btn>

  </v-bottom-navigation>


  <v-dialog
    v-model="settingDialog"
    transition="dialog-bottom-transition"
    @update:modelValue="closeDialog(true)"
    fullscreen
  >
    <v-card>
      <v-toolbar>
        <v-btn
          icon="mdi-close"
          @click="closeDialog(true)"
        ></v-btn>

        <v-toolbar-title>Настройки</v-toolbar-title>

        <v-toolbar-items>
          <v-btn
            text="Сохранить"
            variant="text"
            @click="saveSettings"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-list lines="two">
        <v-list-subheader>МНОЖИТЕЛЬ</v-list-subheader>

        <v-list-item
          v-for="setting in data"
          :key="setting.id"
          :title="setting.name"

        >
          <template #prepend >
            <GokIcon :icon="setting.icon" size="64"/>
          </template>
          <template #default>
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="setting.value"
              @focus="e => e.target.select()"
              clearable
              @click:clear="resetValue(setting.id)"
              :bg-color="setting.value !== defaultsSettings[setting.id] ? 'amber-lighten-4' : ''"
            >
              <template #details v-if="setting.value !== defaultsSettings[setting.id]">
                <div class="text-error text-body-2">
                  Внимание! Был изменён множитель! Значение по-умолчанию равно&nbsp;<span
                  class="font-weight-bold">{{ defaultsSettings[setting.id] }}</span>
                </div>
              </template>
            </v-text-field>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
