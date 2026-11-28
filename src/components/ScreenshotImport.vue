<script setup>
import { ref } from 'vue'
import iMdiCamera from '~icons/mdi/camera-plus-outline'
import { parseWarehouse } from '@/composable/useScreenshotImport.js'
import { charmItems } from '@/config/charm.js'
import { intimacyItems } from '@/config/intimacy.js'
import { meatItems } from '@/config/meat.js'
import { silverItems } from '@/config/silver.js'
import { soldiersItems } from '@/config/soldiers.js'

const allItems = [...charmItems, ...intimacyItems, ...meatItems, ...silverItems, ...soldiersItems]

const props = defineProps({
  // [{ id, icon: { src } }] — например charmItems / intimacyItems
  items: { type: Array, required: true },
})
const emit = defineEmits(['import'])

const input = ref(null)
const reset = ref(false) // true — предметы, которых нет на скриншоте, обнуляются
const loading = ref(false)
const snackbar = ref(false)
const message = ref('')

async function onFiles(e) {
  const files = [...e.target.files]
  e.target.value = '' // чтобы можно было выбрать тот же файл повторно
  if (!files.length) return

  loading.value = true
  try {
    const toRef = i => ({ id: i.id, src: i.icon.src, bg: i.icon.bg })
    const own = props.items.filter(i => i.icon?.src)
    const ownIds = new Set(own.map(i => i.id))
    // предметы других калькуляторов; одинаковые id (medal, chest, forage) — те же иконки, их пропускаем
    const decoys = allItems.filter(i => i.icon?.src && !ownIds.has(i.id))
    const { counts, weak = [] } = await parseWarehouse(files, own.map(toRef), undefined, decoys.map(toRef))
    const found = Object.keys(counts).length
    // сначала обнуляем (если включён switch), потом поверх записываем найденное
    const zeros = reset.value ? Object.fromEntries(own.map(i => [i.id, 0])) : {}
    if (found || reset.value) emit('import', { ...zeros, ...counts })
    const weakNames = weak.map(id => own.find(i => i.id === id)?.name ?? id).join(', ')
    message.value = found
      ? `Распознано предметов: ${found}.` + (weakNames ? ` Проверьте: ${weakNames}.` : '')
      : reset.value
        ? 'Ничего не распознано, предметы сброшены'
        : 'Подходящие предметы не найдены'
  } catch (err) {
    console.error(err)
    message.value = 'Не удалось обработать скриншот'
  } finally {
    loading.value = false
    snackbar.value = true
  }
}
</script>

<template>
  <div class="d-flex flex-wrap align-center ga-3">
    <v-btn
      variant="tonal"
      :prepend-icon="iMdiCamera"
      :loading="loading"
      @click="input.click()"
    >
      Заполнить по скриншоту
    </v-btn>
    <v-switch
      v-model="reset"
      label="Сбросить остальные предметы"
      color="primary"
      density="compact"
      hide-details
    />
  </div>
  <input ref="input" type="file" accept="image/*" multiple hidden @change="onFiles">
  <v-snackbar v-model="snackbar" timeout="4000">{{ message }}</v-snackbar>
</template>
