import { LocalStorageRepository } from './LocalStorageRepository.js'
import { SharedRepository } from './SharedRepository.js'

export class RepositoryFactory {
    static createRepository() {
        const urlParams = new URLSearchParams(window.location.search)
        const shareParam = urlParams.get('share')

        if (shareParam) {
            try {
                const sharedData = JSON.parse(atob(shareParam))
                return new SharedRepository(sharedData)
            } catch (error) {
                console.warn('Invalid shared data, falling back to localStorage')
            }
        }

        return new LocalStorageRepository()
    }

    static clearSharedMode() {
        const url = new URL(window.location)
        url.searchParams.delete('share')
        window.history.replaceState({}, '', url)
        window.location.reload()
    }
}