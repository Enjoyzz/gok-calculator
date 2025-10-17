import { bgIcon } from '@/utils/bgIcon'
import { describe, it, expect } from 'vitest'

describe('bgIcon', () => {
    it('should export color mapping object', () => {
        expect(bgIcon).toEqual({
            orange: expect.any(String),
            red: expect.any(String),
            violet: expect.any(String),
            blue: expect.any(String),
            green: expect.any(String)
        })
    })
})