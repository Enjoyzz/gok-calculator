<script setup>
import {formatLargeNumber} from '@/utils/formatNumbers.js';
import {useTheme} from 'vuetify';

const theme = useTheme();

const props = defineProps({

  total: {
    type: [String, Number],
    required: true,
  },
  settings: {
    type: Object,
  },
  items: {
    type: Array,
  },
  defaultsSettings: {
    type: Object,
  },
  settingsConstraints: {
    type: Object,
    default: {},
  },
});

const isDarkTheme = ref(null);

watch(theme.current, () => {
  isDarkTheme.value = theme.current.value.dark === true;
}, {immediate: true});

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
      ...item,
    };
  });
  settingDialog.value = true;
};

const closeDialog = function(isConfirm = false) {
  // if (isConfirm === true && !confirm('Все изменения не сохранятся') ) {
  //   settingDialog.value = true;
  //   return
  // }

  data.value = oldData.value.map(item => {
    return {
      ...item,
    };
  });

  settingDialog.value = false;
};

const saveSettings = function() {
  emit('save-settings', Object.fromEntries(
    data.value.map(item => [item.id, Number(item.value)]),
  ));

  settingDialog.value = false;
};

const resetValue = function(id) {
  const index = data.value.findIndex(i => i.id === id);
  if (index !== -1) {
    data.value[index].value = props.defaultsSettings[id];
  }
};
</script>

<template>
  <v-bottom-navigation elevation="16"
                       :class="{'bg-grey-lighten-3': !isDarkTheme, 'bg-blue-grey-darken-4': isDarkTheme}">
    <v-card elevation="0" class="text-center flex-grow-1" density="compact" color="transparent"
            :subtitle="$route.meta?.title || 'Итого'">
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
    :fullscreen="false"
    scrollable
    :max-width="600"
  >
    <v-card>
      <v-card-title :class="{'bg-grey-lighten-4': !isDarkTheme, 'bg-blue-grey-darken-4': isDarkTheme}">
        <v-card-item title="Настройки"
                     prepend-icon="mdi-cogs"
        ></v-card-item>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>

        <v-list-subheader>МНОЖИТЕЛЬ</v-list-subheader>

        <div
          class="d-flex ga-1 mb-3"
          v-for="setting in data"
          :key="setting.id"
        >
          <GokIcon :icon="setting.icon" size="64"/>
          <div class="d-flex flex-column flex-grow-1">
            <v-list-item-title>{{setting.name}}</v-list-item-title>
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="setting.value"
              :min="settingsConstraints[setting.id]?.min || null"
              :max="settingsConstraints[setting.id]?.max || null"
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
          </div>

        </div>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions :class="{'bg-grey-lighten-3': !isDarkTheme, 'bg-blue-grey-darken-3': isDarkTheme}">
        <v-spacer></v-spacer>
        <v-btn
          text="Закрыть"
          variant="text"
          @click="closeDialog(true)"
        ></v-btn>

        <v-btn
          color="surface-variant"
          text="Сохранить"
          variant="flat"
          @click="saveSettings"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
