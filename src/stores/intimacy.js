import {defineStore} from 'pinia'

const defaultValues = {
  'concubines': 0,
  'ordos': 0,
  'takya': 0,
  'jadeBracelet': 0,
  'sandalwoodBracelet': 0,
  'goldEarrings': 0,
  'gemRing': 0,
  'loveLetter': 0,
  'forage': 0,
};

export const useIntimacyStore = defineStore('intimacy', {
  state: () => ({
    intimacyValuesRaw: localStorage.getItem('intimacy') || JSON.stringify(defaultValues),
  }),

  getters: {
    intimacyValues: (state) => {
      try {
        console.log(state.intimacyValuesRaw)
        return JSON.parse(state.intimacyValuesRaw)
      } catch (e) {
        console.error(e)
        return defaultValues
      }
    }
  },

  actions: {
    setIntimacyValues(newValues) {
      this.intimacyValuesRaw = JSON.stringify(newValues);
      localStorage.setItem('intimacy', this.intimacyValuesRaw );
    },
  },
})
