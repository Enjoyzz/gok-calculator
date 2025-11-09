export class BaseRepository {

    async loadAppState() {
        throw new Error('Method not implemented')
    }

    async saveAppState(data) {
        throw new Error('Method not implemented')
    }

    canSave() {
        return true
    }

    get name() {
        return 'BaseRepository'
    }
}