export class ShareService {
    static generateShareLink(calculatorData, formulaSettings) {
        try {
            // Подготавливаем данные для sharing
            const shareData = {
                calculatorData: calculatorData,
                formulaSettings: formulaSettings,
                timestamp: new Date().toISOString()
            }

            // Кодируем в base64
            const encodedData = btoa(JSON.stringify(shareData))

            // Создаем URL
            const currentUrl = new URL(window.location.href)
            currentUrl.searchParams.set('share', encodedData)
            return currentUrl.toString()
        } catch (error) {
            console.error('Error generating share link:', error)
            throw new Error('Не удалось создать ссылку для sharing')
        }
    }
}