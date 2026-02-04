/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import 'vuetify/styles'
import iMdiMenu from '~icons/mdi/menu'
import iMdiClose from '~icons/mdi/close'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    aliases: {
      menu: iMdiMenu,
      close: iMdiClose
    }
  },
  theme: {
    defaultTheme: 'system',
    themes: {
      dark: {
        colors: {
          surface: '#1e2931',
        }
      }
    },
  },
})
