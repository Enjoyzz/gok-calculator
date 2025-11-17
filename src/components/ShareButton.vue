<script setup>
import {inject, ref} from 'vue'
import {ShareService} from "@/services/ShareService.js";
import {activeTabKey, calculatorDataKey, formulaSettingsKey, SharedKeySymbol} from "@/data/keys.js"

const { isSharedView} = inject(SharedKeySymbol)
const { calculatorData } = inject(calculatorDataKey)
const { formulaSettings } = inject(formulaSettingsKey)
const activeTab = inject(activeTabKey)

const showShareModal = ref(false)
const shareLink = ref('')
const isCopied = ref(false)

const generateShareLink = async () => {
  return await ShareService.generateShareLink(calculatorData.value, formulaSettings.value, activeTab.value)
}

const openShareModal = async () => {
  shareLink.value = await generateShareLink()

  if (navigator.share) {
    navigator.share({
      title: 'Мои обаяние и близость в Game of Khans',
      text: 'Посмотри мои расчеты обаяния и близости',
      url: shareLink.value,
    })
  } else {
    showShareModal.value = true
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    isCopied.value = true
    setTimeout(() => isCopied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<template>
  <div class="share-section">

    <button @click="openShareModal" class="share-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill"
           viewBox="0 0 16 16">
        <path
            d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
      </svg>
      Поделиться
    </button>


    <div v-if="showShareModal" class="modal-overlay" @click="showShareModal = false">
      <div class="modal-content" @click.stop>
        <h3>Поделиться</h3>
        <p>Отправьте эту ссылку для просмотра данных в режиме только для чтения:</p>
        <div class="link-container">
          <input :value="shareLink" readonly class="link-input" @click="$event.target.select()"/>
          <button @click="copyToClipboard" class="copy-btn">
            {{ isCopied ? 'Скопировано!' : 'Копировать' }}
          </button>
        </div>
        <button @click="showShareModal = false" class="close-btn">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-section {
  margin: 20px 0;
  display: flex;
  justify-content: end;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #4c68af;
  color: white;
  border: none;
  cursor: pointer;
  padding: 7px 10px;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.2s ease;
  margin-bottom: 15px;
}

.share-btn svg {
  flex-shrink: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.link-container {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.link-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.copy-btn, .close-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.copy-btn {
  background: #2196F3;
  color: white;
}

.close-btn {
  background: #f44336;
  color: white;
}
</style>