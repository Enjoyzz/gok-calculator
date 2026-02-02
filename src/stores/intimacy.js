import {defineStore} from 'pinia'

const defaultValues = {
  concubines: 0,
  ordos: 0,
  takya: 0,
  jadeBracelet: 0,
  sandalwoodBracelet: 0,
  goldEarrings: 0,
  gemRing: 0,
  loveLetter: 0,
  forage: 0,
};

const defaultIntimacySettings = {
  ordos: 1.5,
  sandalwoodBracelet: 3,
  forage: 1.2
}

const intimacyValuesRawKey = 'intimacy'
const intimacySettingsRawKey = 'intimacy-setting'

export const useIntimacyStore = defineStore('intimacy', {
  state: () => ({
    intimacyValuesRaw: localStorage.getItem(intimacyValuesRawKey) || JSON.stringify(defaultValues),
    intimacySettingsRaw: localStorage.getItem(intimacySettingsRawKey) || JSON.stringify(defaultIntimacySettings),
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
    },

    intimacySettings: (state) => {
      try {
        // console.log(state.intimacySettingsRaw)
        return JSON.parse(state.intimacySettingsRaw)
      } catch (e) {
        console.error(e)
        return defaultIntimacySettings
      }
    }
  },

  actions: {
    setIntimacyValues(newValues) {
      this.intimacyValuesRaw = JSON.stringify(newValues);
      localStorage.setItem(intimacyValuesRawKey, this.intimacyValuesRaw );
    },
    setIntimacySettings(newValues) {
      this.intimacySettingsRaw = JSON.stringify(newValues);
      localStorage.setItem(intimacySettingsRawKey, this.intimacySettingsRaw );
    },
  },
})
