/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import {
  checkMigrationNeeded,
  CURRENT_VERSION,
  MIGRATION_VERSION_KEY,
  safeMigrateAllData
} from "@/stores/migration.js";


const app = createApp(App)

registerPlugins(app)

//удалить через пару месяцев
if (checkMigrationNeeded()) {
  safeMigrateAllData();
} else {
  localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION);
}


app.mount('#app')
