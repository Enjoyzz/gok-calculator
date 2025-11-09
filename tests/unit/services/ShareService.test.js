import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ShareService } from '@/services/ShareService.js'
import {ref} from "vue";

describe('ShareService.js', () => {
    let originalBtoa
    let originalLocation

    beforeEach(() => {
        originalBtoa = global.btoa
        originalLocation = window.location

        global.btoa = vi.fn((str) => Buffer.from(str).toString('base64'))
        delete window.location
        window.location = new URL('http://localhost')
    })

    afterEach(() => {
        global.btoa = originalBtoa
        window.location = originalLocation
    })

    describe('generateShareLink', () => {
        it('should generate share link with correct data', () => {
            const calcValues = { concubines: 5, blueHadak: 10 }
            const calcSettings = { charm: { blueHadak: 1.5 } }
            const activeTab = 'intimacy'

            const result = ShareService.generateShareLink(calcValues, calcSettings, activeTab)

            expect(result).toContain('http://localhost/?share=')
            expect(global.btoa).toHaveBeenCalled()

            const url = new URL(result)
            const encodedData = url.searchParams.get('share')
            const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString())

            expect(decodedData.calcValues).toEqual(calcValues)
            expect(decodedData.setting).toEqual(calcSettings)
            expect(decodedData.activeTab).toBe(activeTab)
            expect(decodedData.timestamp).toBeDefined()
        })

        it('should handle current URL with existing parameters', () => {
            window.location = new URL('http://localhost/?existing=param')

            const result = ShareService.generateShareLink({}, {}, 'charm')

            expect(result).toContain('http://localhost/?existing=param&share=')
        })

        it('should throw error on encoding failure', () => {
            global.btoa.mockImplementation(() => {
                throw new Error('Encoding failed')
            })

            expect(() => {
                ShareService.generateShareLink({}, {}, 'charm')
            }).toThrow('Не удалось создать ссылку для sharing')
        })

        it('should handle circular references in data', () => {
            const circularData = { test: 'data' }
            circularData.self = circularData

            expect(() => {
                ShareService.generateShareLink(circularData, {}, 'charm')
            }).toThrow()
        })
    })

    describe('Data structure', () => {
        it('should include timestamp in share data', () => {
            const before = new Date()
            const result = ShareService.generateShareLink({}, {}, 'charm')

            const url = new URL(result)
            const encodedData = url.searchParams.get('share')
            const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString())

            const timestamp = new Date(decodedData.timestamp)
            expect(timestamp).toBeInstanceOf(Date)
            expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
        })

        it('should preserve all input data', () => {
            const calcValues = {
                concubines: 3,
                blueHadak: 5,
                whiteHadak: 10,
                goldHairpin: 2
            }
            const calcSettings = {
                charm: { blueHadak: 1.5, silverHairpin: 3 },
                intimacy: { ordos: 1.5, sandalwoodBracelet: 3 }
            }
            const activeTab = 'charm'

            const result = ShareService.generateShareLink(calcValues, calcSettings, activeTab)
            const encodedData = result.split('share=')[1]
            const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString())

            expect(decodedData.calcValues).toEqual(calcValues)
            expect(decodedData.setting).toEqual(calcSettings)
            expect(decodedData.activeTab).toBe(activeTab)
        })
    })
})