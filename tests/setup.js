import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'

// Мокаем Vuetify полностью
vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn()
  })
}))

