import {defineStore} from 'pinia'

const defaultValues = {
  'concubines': 0,
  'blueHadak': 0,
  'whiteHadak': 0,
  'goldHairpin': 0,
  'silverHairpin': 0,
  'perfume': 0,
  'chests': 0,
  'forage': 0,
};

export const useCharmStore = defineStore('charm', {
  state: () => ({
    charmValuesRaw: localStorage.getItem('charm') || JSON.stringify(defaultValues),
  }),

  getters: {
    charmValues: (state) => {
      try {
        console.log(state.charmValuesRaw)
        return JSON.parse(state.charmValuesRaw)
      } catch (e) {
        console.error(e)
        return defaultValues
      }
    }
  },

  actions: {
    setCharmValues(newValues) {
      this.charmValuesRaw = JSON.stringify(newValues);
      localStorage.setItem('charm', this.charmValuesRaw );
    },
  },
})
