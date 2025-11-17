export class ShareService {
    static async generateShareLink(calculatorData, formulaSettings, activeTab) {
        try {
            // Подготавливаем данные для sharing
            const shareData = {
                calculatorData: calculatorData,
                formulaSettings: formulaSettings,
                timestamp: new Date().toISOString(),
                activeTab: activeTab
            }

            console.log('Prepare shared data: ', shareData);

            // Кодируем в base64
            const encodedData = btoa(JSON.stringify(shareData))

            // Создаем URL
            const currentUrl = new URL(window.location.href)
            currentUrl.searchParams.set('share', encodedData)

            console.log('Generate share link: ', currentUrl.toString(), currentUrl)

            return await this.shortenUrl(currentUrl.toString())
        } catch (error) {
            console.error('Error generating share link:', error)
            throw new Error('Не удалось создать ссылку для sharing')
        }
    }

    static async shortenUrl(longUrl) {
        try {
            const endpoint = 'https://clck.ru/--'

            const formData = new FormData()
            formData.append('url', longUrl)

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const shortUrl = await response.text()

            if (shortUrl && shortUrl.startsWith('https://clck.ru/')) {
                console.log('Shortened URL:', shortUrl)
                return shortUrl
            } else {
                throw new Error('Invalid response from URL shortener: ' + shortUrl)
            }
        } catch (error) {
            console.error('Error shortening URL:', error)
            return longUrl
        }
    }
}