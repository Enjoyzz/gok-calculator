import { BaseRepository } from './BaseRepository.js'
import { defaultAppState } from '@/data/defaults.js'


export class LocalStorageRepository extends BaseRepository {
    constructor() {
        super()
        this.keys = {
            APP_STATE: 'appState'
        }
    }

    get name() {
        return 'LocalStorageRepository'
    }

    async loadAppState() {
        try {
            const saved = localStorage.getItem(this.keys.APP_STATE)
            return saved
                ? { ...defaultAppState, ...JSON.parse(saved) }
                : defaultAppState
        } catch (error) {
            console.warn('Error loading app state:', error)
            return defaultAppState
        }
    }

    async saveAppState(state) {
        try {
            localStorage.setItem(this.keys.APP_STATE, JSON.stringify(state))
            return true
        } catch (error) {
            console.error('Error saving app state:', error)
            return false
        }
    }

    async resetSettings() {
        const currentState = await this.loadAppState()
        return await this.saveAppState({
            ...currentState,
            setting: defaultAppState.setting
        })
    }

}