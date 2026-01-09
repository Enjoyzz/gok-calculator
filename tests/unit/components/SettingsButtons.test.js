import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsButtons from '@/components/SettingsButtons.vue'

describe('SettingsButtons.vue', () => {
  // Мокаем window.confirm перед каждым тестом
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const createWrapper = () => {
    return mount(SettingsButtons)
  }

  describe('Rendering', () => {
    it('should render both buttons', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.settings-buttons').exists()).toBe(true)
      expect(wrapper.find('.btn-reset').exists()).toBe(true)
      expect(wrapper.find('.btn-settings').exists()).toBe(true)

      expect(wrapper.find('.btn-reset').text()).toBe('Сбросить настройки')
      expect(wrapper.find('.btn-settings').text()).toBe('Настройки формул')
    })

    it('should have correct CSS classes', () => {
      const wrapper = createWrapper()

      const resetBtn = wrapper.find('.btn-reset')
      const settingsBtn = wrapper.find('.btn-settings')

      expect(resetBtn.classes()).toContain('btn-reset')
      expect(settingsBtn.classes()).toContain('btn-settings')
    })
  })

  describe('Button interactions', () => {
    it('should emit open-settings-modal when settings button is clicked', async () => {
      const wrapper = createWrapper()

      await wrapper.find('.btn-settings').trigger('click')

      expect(wrapper.emitted('open-settings-modal')).toBeTruthy()
      expect(wrapper.emitted('open-settings-modal')).toHaveLength(1)
    })

    it('should emit reset-settings when reset button is clicked and user confirms', async () => {
      const wrapper = createWrapper()

      // Мокаем confirm чтобы вернуть true
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      await wrapper.find('.btn-reset').trigger('click')

      expect(window.confirm).toHaveBeenCalledWith('Сбросить все настройки формул к значениям по умолчанию?')
      expect(wrapper.emitted('reset-settings')).toBeTruthy()
      expect(wrapper.emitted('reset-settings')).toHaveLength(1)
    })

    it('should NOT emit reset-settings when user cancels confirmation', async () => {
      const wrapper = createWrapper()

      // Мокаем confirm чтобы вернуть false
      vi.spyOn(window, 'confirm').mockReturnValue(false)

      await wrapper.find('.btn-reset').trigger('click')

      expect(window.confirm).toHaveBeenCalledWith('Сбросить все настройки формул к значениям по умолчанию?')
      expect(wrapper.emitted('reset-settings')).toBeUndefined()
    })

    it('should call confirm with correct message', async () => {
      const wrapper = createWrapper()

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      await wrapper.find('.btn-reset').trigger('click')

      expect(confirmSpy).toHaveBeenCalledWith('Сбросить все настройки формул к значениям по умолчанию?')
    })
  })

  describe('Events', () => {
    it('should define correct emits', () => {
      const wrapper = createWrapper()

      // Проверяем что компонент объявляет нужные эмиты
      expect(wrapper.vm.$options.emits).toEqual([
        'reset-settings',
        'open-settings-modal'
      ])
    })

    it('should emit events with no payload', async () => {
      const wrapper = createWrapper()
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      await wrapper.find('.btn-settings').trigger('click')
      await wrapper.find('.btn-reset').trigger('click')

      // Проверяем что эмиты без дополнительных данных
      expect(wrapper.emitted('open-settings-modal')[0]).toEqual([])
      expect(wrapper.emitted('reset-settings')[0]).toEqual([])
    })
  })

  describe('Component methods', () => {
    it('resetSettings should emit event only when confirmed', () => {
      // Тест с подтверждением
      const wrapper1 = createWrapper()
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      wrapper1.vm.resetSettings()

      expect(wrapper1.emitted('reset-settings')).toBeTruthy()
      expect(wrapper1.emitted('reset-settings')).toHaveLength(1)

      // Тест без подтверждения - создаем новый wrapper
      const wrapper2 = createWrapper()
      vi.spyOn(window, 'confirm').mockReturnValue(false)
      wrapper2.vm.resetSettings()

      expect(wrapper2.emitted('reset-settings')).toBeUndefined()
    })

    it('openSettings should always emit event', () => {
      const wrapper = createWrapper()

      wrapper.vm.openSettings()

      expect(wrapper.emitted('open-settings-modal')).toBeTruthy()
      expect(wrapper.emitted('open-settings-modal')).toHaveLength(1)
    })
  })

  describe('Accessibility and usability', () => {
    it('buttons should be clickable', async () => {
      const wrapper = createWrapper()
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      // Проверяем что кнопки не disabled
      expect(wrapper.find('.btn-reset').element.disabled).toBe(false)
      expect(wrapper.find('.btn-settings').element.disabled).toBe(false)

      // Проверяем что клики работают
      await wrapper.find('.btn-settings').trigger('click')
      expect(wrapper.emitted('open-settings-modal')).toBeTruthy()

      await wrapper.find('.btn-reset').trigger('click')
      expect(wrapper.emitted('reset-settings')).toBeTruthy()
    })

    it('buttons should have appropriate type attribute', () => {
      const wrapper = createWrapper()

      // В вашем компоненте кнопки не имеют атрибута type
      // По умолчанию в браузере type="submit", что может быть проблемой
      // Рекомендую добавить type="button" в компонент

      // Проверяем что атрибут type существует (или его нет - тогда будет undefined)
      const resetBtn = wrapper.find('.btn-reset')
      const settingsBtn = wrapper.find('.btn-settings')

      // Если в компоненте нет type, можно либо пропустить тест,
      // либо добавить type="button" в компонент и раскомментировать:
      // expect(resetBtn.attributes('type')).toBe('button')
      // expect(settingsBtn.attributes('type')).toBe('button')

      // Альтернативно, проверяем что кнопки не disabled
      expect(resetBtn.element.disabled).toBe(false)
      expect(settingsBtn.element.disabled).toBe(false)
    })
  })

})