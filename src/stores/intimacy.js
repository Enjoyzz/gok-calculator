import {defineStore} from 'pinia';
import {defaultIntimacySettings, defaultValues} from '@/config/intimacy.js';

const intimacyValuesRawKey = 'intimacy';
const intimacySettingsRawKey = 'intimacy-setting';

export const useIntimacyStore = defineStore('intimacy', {
  state: () => ({
    intimacyValuesRaw: localStorage.getItem(intimacyValuesRawKey) ||
      JSON.stringify(defaultValues),
    intimacySettingsRaw: localStorage.getItem(intimacySettingsRawKey) ||
      JSON.stringify(defaultIntimacySettings),
  }),

  getters: {
    intimacyValues: (state) => {
      try {
        return JSON.parse(state.intimacyValuesRaw);
      } catch (e) {
        console.error(e);
        return defaultValues;
      }
    },

    intimacySettings: (state) => {
      try {
        return JSON.parse(state.intimacySettingsRaw);
      } catch (e) {
        console.error(e);
        return defaultIntimacySettings;
      }
    },
    defaultIntimacySettings: () => defaultIntimacySettings,
  },

  actions: {
    setIntimacyValues(newValues) {
      console.log(newValues);
      this.intimacyValuesRaw = JSON.stringify(newValues);
      localStorage.setItem(intimacyValuesRawKey, this.intimacyValuesRaw);
    },
    setIntimacySettings(newValues) {
      this.intimacySettingsRaw = JSON.stringify(newValues);
      localStorage.setItem(intimacySettingsRawKey, this.intimacySettingsRaw);
    },
  },
});
