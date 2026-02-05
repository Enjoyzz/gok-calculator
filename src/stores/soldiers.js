import {defineStore} from 'pinia';
import {defaultValues} from '@/config/soldiers.js';

const soldiersValuesRawKey = 'soldiers';

export const useSoldiersStore = defineStore('soldiers', {
  state: () => ({
    soldiersValuesRaw: localStorage.getItem(soldiersValuesRawKey) ||
      JSON.stringify(defaultValues),
  }),

  getters: {
    soldiersValues: (state) => {
      try {
        return JSON.parse(state.soldiersValuesRaw);
      } catch (e) {
        console.error(e);
        return defaultValues;
      }
    },
  },

  actions: {
    setSoldiersValues(newValues) {
      console.log(newValues);
      this.soldiersValuesRaw = JSON.stringify(newValues);
      localStorage.setItem(soldiersValuesRawKey, this.soldiersValuesRaw);
    },
  },
});
