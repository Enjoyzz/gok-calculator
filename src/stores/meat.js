import {defineStore} from 'pinia';
import {defaultValues} from '@/config/meat.js';

const meatValuesRawKey = 'meat';

export const useMeatStore = defineStore('meat', {
  state: () => ({
    meatValuesRaw: localStorage.getItem(meatValuesRawKey) ||
      JSON.stringify(defaultValues),
  }),

  getters: {
    meatValues: (state) => {
      try {
        return JSON.parse(state.meatValuesRaw);
      } catch (e) {
        console.error(e);
        return defaultValues;
      }
    },
  },

  actions: {
    setMeatValues(newValues) {
      this.meatValuesRaw = JSON.stringify(newValues);
      localStorage.setItem(meatValuesRawKey, this.meatValuesRaw);
    },
  },
});
