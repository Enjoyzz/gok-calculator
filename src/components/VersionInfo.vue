<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Показывать "dev" в development
  hideInDev: {
    type: Boolean,
    default: true
  },
  showBuildTime: {
    type: Boolean,
    default: false
  },
  showGitShaShort: {
    type: Boolean,
    default: true
  },
  prefix: {
    type: String,
    default: 'v'
  }
})

const version = computed(() =>
    import.meta.env.VITE_APP_RELEASE_VERSION || '1.0.0'
)

const buildDate  = computed(() =>
    import.meta.env.VITE_APP_BUILD_DATE ||  ''
)

const gitShaShort  = computed(() =>
    import.meta.env.VITE_APP_GIT_SHA_SHORT ||  ''
)

const isDevelopment = computed(() =>
    import.meta.env.DEV ||
    import.meta.env.NODE_ENV === 'development'
)

const showVersion = computed(() => {
  return !(props.hideInDev && isDevelopment.value);
})

const versionText = computed(() => {
  const ver = version.value

  if (!showVersion.value) return ''

  if (isDevelopment.value) {
    return 'dev'
  }

  // Убираем 'v' из начала, если есть
  const cleanVersion = ver.startsWith('v') ? ver.slice(1) : ver

  let buildTime = ''

  if (props.showBuildTime) {
    try {
      const date = new Date(buildDate.value)
      console.log(date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date')
      }

      const year = date.getUTCFullYear().toString() // 25
      const month = String(date.getUTCMonth() + 1).padStart(2, '0') // 01
      const day = String(date.getUTCDate()).padStart(2, '0') // 09
      buildTime = `@${year}${month}${day}` // @250109
    } catch (e) {
      console.warn('Failed to parse release date:', e)
    }
  }

  let gitShaShortValue = ''
  if (props.showGitShaShort && gitShaShort.value !== '') {
      gitShaShortValue = '@' + gitShaShort.value
  }


  return `${props.prefix}${cleanVersion}${buildTime}${gitShaShortValue}`
})
</script>

<template>
  <div v-if="showVersion" class="version-badge">
    {{ versionText }}
  </div>
</template>

<style scoped>
.version-badge {
  display: inline-block;
  font-size: 12px;
  font-family: monospace;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #ddd;
}
</style>