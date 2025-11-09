import { BaseRepository } from './BaseRepository.js'
import { defaultAppState } from '@/data/defaults.js'


export class SharedRepository extends BaseRepository {
    constructor(sharedData) {
        super()

        if (!this.validateStructure(sharedData)) {
            throw new Error('Invalid shared data structure')
        }

        this.sharedData = sharedData
    }

    validateStructure(sharedData) {
        const requiredKeys = Object.keys(defaultAppState)
        return requiredKeys.every(key => key in sharedData)
    }

    get name() {
        return 'SharedRepository'
    }

    async loadAppState() {
        return this.sharedData || {}
    }


    async saveAppState() {
        console.warn('📖 Read-only mode: Cannot save in shared view')
        return false
    }

    async saveFormulas() {
        console.warn('📖 Read-only mode: Cannot save formulas in shared view')
        return false
    }

    tab() {
        return this.sharedData.activeTab || 'charm'
    }

    canSave() {
        return false
    }
}