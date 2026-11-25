import {defineStore} from 'pinia';
import {defaultValues} from '@/config/pet-type-boon.js';

const petTypeBoonValuesRawKey = 'pet-type-boon';

export const usePetTypeBoonRawStore = defineStore('petTypeBoon', {
  state: () => ({
    petTypeBoonRaw: localStorage.getItem(petTypeBoonValuesRawKey) ||
      JSON.stringify(defaultValues),
  }),

  getters: {
    petTypeBoonValues: (state) => {
      try {
        return JSON.parse(state.petTypeBoonRaw);
      } catch (e) {
        console.error(e);
        return defaultValues;
      }
    },
  },

  actions: {
    setPetTypeBoonValues(newValues) {
      console.log(newValues);
      this.petTypeBoonRaw = JSON.stringify(newValues);
      localStorage.setItem(petTypeBoonValuesRawKey, this.petTypeBoonRaw);
    },
  },
});
