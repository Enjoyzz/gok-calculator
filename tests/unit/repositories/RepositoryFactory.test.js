import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RepositoryFactory } from '@/repositories/RepositoryFactory.js'
import { LocalStorageRepository } from '@/repositories/LocalStorageRepository.js'
import { SharedRepository } from '@/repositories/SharedRepository.js'

// Мокаем репозитории
vi.mock('@/repositories/LocalStorageRepository.js')
vi.mock('@/repositories/SharedRepository.js')

describe('RepositoryFactory.js', () => {
    let originalLocation

    beforeEach(() => {
        vi.clearAllMocks()
        originalLocation = window.location
        delete window.location
        window.location = new URL('http://localhost')
    })

    afterEach(() => {
        window.location = originalLocation
    })

    describe('createRepository', () => {
        it('should create LocalStorageRepository by default', () => {
            const repository = RepositoryFactory.createRepository()

            expect(LocalStorageRepository).toHaveBeenCalled()
            expect(SharedRepository).not.toHaveBeenCalled()
        })

        it('should create SharedRepository when share parameter exists', () => {
            window.location = new URL('http://localhost?share=eyJ0ZXN0IjoiZGF0YSJ9')
            const mockSharedData = { test: 'data' }
            SharedRepository.mockImplementation(() => ({ sharedData: mockSharedData }))

            const repository = RepositoryFactory.createRepository()

            expect(SharedRepository).toHaveBeenCalledWith(mockSharedData)
        })

        it('should fallback to LocalStorageRepository on invalid share data', () => {
            window.location = new URL('http://localhost?share=invalid-base64')

            const repository = RepositoryFactory.createRepository()

            expect(LocalStorageRepository).toHaveBeenCalled()
        })
    })

    describe('clearSharedMode', () => {
        beforeEach(() => {
            // Мокаем reload для всех тестов
            Object.defineProperty(window, 'location', {
                configurable: true,
                value: { reload: vi.fn() }
            })
        })

        it('should remove share parameter from URL', () => {
            const urlMock = {
                searchParams: { delete: vi.fn() },
                toString: vi.fn().mockReturnValue('http://localhost/')
            }
            global.URL = vi.fn().mockImplementation(() => urlMock)
            const replaceStateMock = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})

            RepositoryFactory.clearSharedMode()

            expect(urlMock.searchParams.delete).toHaveBeenCalledWith('share')
            expect(replaceStateMock).toHaveBeenCalled()
        })

        it('should reload page after clearing shared mode', () => {
            const urlMock = {
                searchParams: { delete: vi.fn() },
                toString: vi.fn()
            }
            global.URL = vi.fn().mockImplementation(() => urlMock)
            vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})

            RepositoryFactory.clearSharedMode()

            expect(window.location.reload).toHaveBeenCalled()
        })
    })
})