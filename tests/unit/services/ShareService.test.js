import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ShareService } from '@/services/ShareService.js'

describe('ShareService.js', () => {
    let originalBtoa
    let originalLocation
    let originalFetch

    beforeEach(() => {
        originalBtoa = global.btoa
        originalLocation = window.location
        originalFetch = global.fetch

        global.btoa = vi.fn((str) => Buffer.from(str).toString('base64'))
        global.fetch = vi.fn()
        delete window.location
        window.location = new URL('http://localhost')
    })

    afterEach(() => {
        global.btoa = originalBtoa
        window.location = originalLocation
        global.fetch = originalFetch
    })

    describe('generateShareLink', () => {
        it('should generate share link with correct data', async () => {
            const calculatorData = { concubines: 5, blueHadak: 10 }
            const formulaSettings = { charm: { blueHadak: 1.5 } }
            const activeTab = 'intimacy'

            // Мокаем успешный ответ от сервиса сокращения
            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('https://clck.ru/abc123')
            })

            const result = await ShareService.generateShareLink(calculatorData, formulaSettings, activeTab)

            expect(result).toBe('https://clck.ru/abc123')
            expect(global.btoa).toHaveBeenCalled()

            // Проверяем, что fetch был вызван с правильными параметрами
            expect(global.fetch).toHaveBeenCalledWith(
                'https://clck.ru/--',
                {
                    method: 'POST',
                    body: expect.any(FormData)
                }
            )
        })

        it('should return original URL if shortening fails', async () => {
            const calculatorData = { concubines: 5, blueHadak: 10 }
            const formulaSettings = { charm: { blueHadak: 1.5 } }
            const activeTab = 'intimacy'

            // Мокаем ошибку от сервиса сокращения
            global.fetch.mockRejectedValueOnce(new Error('Network error'))

            const result = await ShareService.generateShareLink(calculatorData, formulaSettings, activeTab)

            // Должен вернуться оригинальный URL
            expect(result).toContain('http://localhost/?share=')
        })

        it('should handle current URL with existing parameters', async () => {
            window.location = new URL('http://localhost/?existing=param')
            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('https://clck.ru/def456')
            })

            const result = await ShareService.generateShareLink({}, {}, 'charm')

            expect(result).toBe('https://clck.ru/def456')
        })

        it('should throw error on encoding failure', async () => {
            global.btoa.mockImplementation(() => {
                throw new Error('Encoding failed')
            })

            await expect(
                ShareService.generateShareLink({}, {}, 'charm')
            ).rejects.toThrow('Не удалось создать ссылку для sharing')
        })

        it('should handle circular references in data', async () => {
            const circularData = { test: 'data' }
            circularData.self = circularData

            await expect(
                ShareService.generateShareLink(circularData, {}, 'charm')
            ).rejects.toThrow()
        })
    })

    describe('Data structure', () => {
        it('should include timestamp in share data', async () => {
            const before = new Date()
            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('https://clck.ru/ghi789')
            })

            const result = await ShareService.generateShareLink({}, {}, 'charm')

            // Проверяем, что данные правильно формируются перед отправкой
            expect(global.btoa).toHaveBeenCalled()
            const encodedData = global.btoa.mock.calls[0][0]
            const decodedData = JSON.parse(encodedData)

            const timestamp = new Date(decodedData.timestamp)
            expect(timestamp).toBeInstanceOf(Date)
            expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
        })

        it('should preserve all input data', async () => {
            const calculatorData = {
                concubines: 3,
                blueHadak: 5,
                whiteHadak: 10,
                goldHairpin: 2
            }
            const formulaSettings = {
                charm: { blueHadak: 1.5, silverHairpin: 3 },
                intimacy: { ordos: 1.5, sandalwoodBracelet: 3 }
            }
            const activeTab = 'charm'

            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('https://clck.ru/jkl012')
            })

            await ShareService.generateShareLink(calculatorData, formulaSettings, activeTab)

            // Проверяем, что правильные данные были закодированы
            expect(global.btoa).toHaveBeenCalled()
            const encodedData = global.btoa.mock.calls[0][0]
            const decodedData = JSON.parse(encodedData)

            expect(decodedData.calculatorData).toEqual(calculatorData)
            expect(decodedData.formulaSettings).toEqual(formulaSettings)
            expect(decodedData.activeTab).toBe(activeTab)
        })
    })

    describe('URL shortening', () => {
        it('should handle invalid response from shortener', async () => {
            const calculatorData = { concubines: 5, blueHadak: 10 }

            // Мокаем невалидный ответ (не начинается с https://clck.ru/)
            global.fetch.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('invalid-response')
            })

            const result = await ShareService.generateShareLink(calculatorData, {}, 'charm')

            // Должен вернуться оригинальный URL
            expect(result).toContain('http://localhost/?share=')
        })

        it('should handle HTTP error from shortener', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            })

            const result = await ShareService.generateShareLink({}, {}, 'charm')

            // Должен вернуться оригинальный URL
            expect(result).toContain('http://localhost/?share=')
        })
    })
})