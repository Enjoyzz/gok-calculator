import {defineStore} from 'pinia';
import {defaultValues} from '@/config/silver.js';

const silverValuesRawKey = 'silver';

export const useSilverStore = defineStore('silver', {
  state: () => ({
    silverValuesRaw: localStorage.getItem(silverValuesRawKey) ||
      JSON.stringify(defaultValues),
  }),

  getters: {
    silverValues: (state) => {
      try {
        return JSON.parse(state.silverValuesRaw);
      } catch (e) {
        console.error(e);
        return defaultValues;
      }
    },
  },

  actions: {
    setSilverValues(newValues) {
      console.log(newValues);
      this.silverValuesRaw = JSON.stringify(newValues);
      localStorage.setItem(silverValuesRawKey, this.silverValuesRaw);
    },
  },
});
