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

const defaultCharmSettings = {
  blueHadak: 1.5,
  silverHairpin: 3,
  chests: 2.2,
  forage: 1.5
}

const charmValuesRawKey = 'charm'
const charmSettingsRawKey = 'charm-setting'

export const useCharmStore = defineStore('charm', {
  state: () => ({
    charmValuesRaw: localStorage.getItem(charmValuesRawKey) || JSON.stringify(defaultValues),
    charmSettingsRaw: localStorage.getItem(charmSettingsRawKey) || JSON.stringify(defaultCharmSettings),
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
    },
    charmSettings: (state) => {
      try {
        console.log(state.charmSettingsRaw)
        return JSON.parse(state.charmSettingsRaw)
      } catch (e) {
        console.error(e)
        return defaultCharmSettings
      }
    }
  },

  actions: {
    setCharmValues(newValues) {
      this.charmValuesRaw = JSON.stringify(newValues);
      localStorage.setItem(charmValuesRawKey, this.charmValuesRaw );
    },
    setCharmSettings(newValues) {
      this.charmSettingsRaw = JSON.stringify(newValues);
      localStorage.setItem(charmSettingsRawKey, this.charmSettingsRaw );
    },
  },
})
