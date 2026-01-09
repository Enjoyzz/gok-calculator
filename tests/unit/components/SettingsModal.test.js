import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsModal from '@/components/SettingsModal.vue'
import {formulaSettingsKey} from "@/data/keys.js";
import {ref} from "vue";

describe('SettingsModal.vue', () => {
  const defaultFormulas = {
    charm: {
      blueHadak: 1.5,
      silverHairpin: 3,
      chests: 2.2,
      forage: 1.5
    },
    intimacy: {
      ordos: 1.5,
      sandalwoodBracelet: 3,
      forage: 1.2
    }
  }

  const createWrapper = (props = {}) => {
    return mount(SettingsModal, {
      props: {
        openSetting: null,
        ...props
      },
      global: {
        provide: {
          [formulaSettingsKey]: {
            formulaSettings: ref(defaultFormulas)
          }
        }
      }
    })
  }

  describe('Initialization', () => {
    it('should not show modal by default', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('#settings-modal').exists()).toBe(false)
    })

    it('should open modal when openSetting changes from null to non-null', async () => {
      const wrapper = createWrapper({ openSetting: null })

      await wrapper.setProps({ openSetting: 'charm.blueHadak' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#settings-modal').exists()).toBe(true)
    })
  })

  describe('Modal open/close behavior', () => {
    it('should open modal via internal openSettings method', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#settings-modal').exists()).toBe(true)
    })

    it('should close modal via internal closeSettings method', async () => {
      const wrapper = createWrapper()

      // Открываем
      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#settings-modal').exists()).toBe(true)

      // Закрываем
      await wrapper.vm.closeSettings()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#settings-modal').exists()).toBe(false)
    })

    it('should emit close-setting-modal when closing via closeSettings', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.closeSettings()

      expect(wrapper.emitted('close-setting-modal')).toBeTruthy()
    })

    it('should close modal when clicking cancel button', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      await wrapper.find('.settings-btn-secondary').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#settings-modal').exists()).toBe(false)
      expect(wrapper.emitted('close-setting-modal')).toBeTruthy()
    })

    it('should close modal when clicking backdrop', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      await wrapper.find('#settings-modal').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#settings-modal').exists()).toBe(false)
      expect(wrapper.emitted('close-setting-modal')).toBeTruthy()
    })

    it('should NOT close modal when clicking modal content (not backdrop)', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      // Кликаем на контент модалки (не на бэкдроп)
      await wrapper.find('#settings-modal-content').trigger('click')
      await wrapper.vm.$nextTick()

      // Модалка должна остаться открытой
      expect(wrapper.find('#settings-modal').exists()).toBe(true)
    })

    it('should close modal when saving', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      await wrapper.find('.settings-btn-primary').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#settings-modal').exists()).toBe(false)
    })
  })

  describe('Form rendering based on openSetting', () => {
    it('should render all settings when opened via openSettings()', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Обаяние')
      expect(wrapper.text()).toContain('Близость')
      expect(wrapper.text()).toContain('Синий хадак (множитель)')
      expect(wrapper.text()).toContain('Ордос (множитель)')
    })

    it('should render only charm settings when openSetting starts with "charm"', async () => {
      const wrapper = createWrapper({ openSetting: null })

      await wrapper.setProps({ openSetting: 'charm.blueHadak' })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Обаяние')
      expect(wrapper.text()).toContain('Синий хадак (множитель)')
      expect(wrapper.text()).not.toContain('Близость')
      expect(wrapper.text()).not.toContain('Ордос (множитель)')
    })

    it('should render only intimacy settings when openSetting starts with "intimacy"', async () => {
      const wrapper = createWrapper({ openSetting: null })

      await wrapper.setProps({ openSetting: 'intimacy.ordos' })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Близость')
      expect(wrapper.text()).toContain('Ордос (множитель)')
      expect(wrapper.text()).not.toContain('Обаяние')
      expect(wrapper.text()).not.toContain('Синий хадак (множитель)')
    })
  })

  describe('Form actions and validation', () => {
    it('should emit save event with updated data', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      // Находим первый инпут (синий хадак) и меняем значение
      const inputs = wrapper.findAll('input[type="number"]')
      await inputs[0].setValue(2.5)

      await wrapper.find('.settings-btn-primary').trigger('click')

      expect(wrapper.emitted('save')).toBeTruthy()
      expect(wrapper.emitted('save')[0][0].charm.blueHadak).toBe(2.5)
    })

    it('should validate required fields', async () => {
      const wrapper = createWrapper()

      await wrapper.vm.openSettings()
      await wrapper.vm.$nextTick()

      const input = wrapper.find('input[type="number"]')
      const reportValiditySpy = vi.spyOn(input.element, 'reportValidity')

      // Устанавливаем невалидное значение (пустая строка)
      await input.setValue('')

      // Вызываем валидацию через метод
      wrapper.vm.validateField(input.element)

      expect(reportValiditySpy).toHaveBeenCalled()
    })
  })
  describe('Watcher behavior', () => {
    it('should show modal when openSetting changes to non-null value', async () => {
      const wrapper = createWrapper({ openSetting: null })

      // Проверяем, что модалка изначально скрыта
      expect(wrapper.find('#settings-modal').exists()).toBe(false)

      // Меняем пропс
      await wrapper.setProps({ openSetting: 'charm.blueHadak' })
      await wrapper.vm.$nextTick()

      // Проверяем результат - модалка должна быть открыта
      expect(wrapper.find('#settings-modal').exists()).toBe(true)
    })

    it('should keep modal open when openSetting changes to null', async () => {
      const wrapper = createWrapper({ openSetting: null })

      // Открываем модалку
      await wrapper.setProps({ openSetting: 'charm.blueHadak' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#settings-modal').exists()).toBe(true)

      // Меняем на null
      await wrapper.setProps({ openSetting: null })
      await wrapper.vm.$nextTick()

      // Модалка должна остаться открытой (не закрывается через watcher)
      expect(wrapper.find('#settings-modal').exists()).toBe(true)
    })
  })
})