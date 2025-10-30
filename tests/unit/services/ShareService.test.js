import { ShareService } from './ShareService'

describe('ShareService', () => {
    const mockCalculatorData = { charm: 100, intimacy: 200 }
    const mockFormulas = { charm: { multiplier: 2 } }
    const mockActiveTab = 'charm'

    beforeEach(() => {
        // Mock window.location
        delete window.location
        window.location = new URL('https://example.com')
    })

    describe('generateShareLink', () => {
        it('should generate valid share link', () => {
            const shareLink = ShareService.generateShareLink(
                mockCalculatorData,
                mockFormulas,
                mockActiveTab
            )

            expect(shareLink).toContain('https://example.com/?share=')

            const url = new URL(shareLink)
            const shareParam = url.searchParams.get('share')
            const decodedData = JSON.parse(atob(shareParam))

            expect(decodedData.calculatorData).toEqual(mockCalculatorData)
            expect(decodedData.formulaSettings).toEqual(mockFormulas)
            expect(decodedData.activeTab).toBe(mockActiveTab)
        })

        it('should include timestamp', () => {
            const before = new Date()
            const shareLink = ShareService.generateShareLink(mockCalculatorData, mockFormulas, mockActiveTab)

            const url = new URL(shareLink)
            const shareParam = url.searchParams.get('share')
            const decodedData = JSON.parse(atob(shareParam))

            const timestamp = new Date(decodedData.timestamp)
            expect(timestamp).toBeInstanceOf(Date)
            expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
        })

        it('should handle encoding errors', () => {
            // Create circular reference to cause JSON.stringify error
            const circularData = { data: {} }
            circularData.data.self = circularData

            expect(() => {
                ShareService.generateShareLink(circularData, mockFormulas, mockActiveTab)
            }).toThrow('Не удалось создать ссылку для sharing')
        })
    })
})