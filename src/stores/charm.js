import {defineStore} from 'pinia';
import {defaultCharmSettings, defaultValues} from '@/config/charm.js';

const charmValuesRawKey = 'charm';
const charmSettingsRawKey = 'charm-setting';

export const useCharmStore = defineStore('charm', {
  state: () => ({
    charmValuesRaw: localStorage.getItem(charmValuesRawKey) ||
      JSON.stringify(defaultValues),
    charmSettingsRaw: localStorage.getItem(charmSettingsRawKey) ||
      JSON.stringify(defaultCharmSettings),
  }),

  getters: {
    charmValues: (state) => {
      try {
        return JSON.parse(state.charmValuesRaw);
      } catch (e) {
        console.error(e);
        return defaultValues;
      }
    },
    charmSettings: (state) => {
      try {
        return JSON.parse(state.charmSettingsRaw);
      } catch (e) {
        console.error(e);
        return defaultCharmSettings;
      }
    },
    defaultCharmSettings: () => defaultCharmSettings,
  },

  actions: {
    setCharmValues(newValues) {
      this.charmValuesRaw = JSON.stringify(newValues);
      localStorage.setItem(charmValuesRawKey, this.charmValuesRaw);
    },
    setCharmSettings(newValues) {
      this.charmSettingsRaw = JSON.stringify(newValues);
      localStorage.setItem(charmSettingsRawKey, this.charmSettingsRaw);
    },
  },
});
