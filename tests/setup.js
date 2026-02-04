import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Создаем экземпляр Vuetify
const vuetify = createVuetify({
  components,
  directives,
})

// Глобальная конфигурация Vue Test Utils
config.global.plugins = [vuetify, createPinia()]
