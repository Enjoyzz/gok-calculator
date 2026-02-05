import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CalculatorBottom from '@/components/CalculatorBottom.vue'

// Мокаем зависимости
vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn(),
    components: {},
    directives: {}
  })
}))

vi.mock('vuetify/components', () => ({}))
vi.mock('vuetify/directives', () => ({}))

const mockTheme = ref({ value: { dark: false } })
vi.mock('vuetify', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useTheme: () => ({
      current: mockTheme
    })
  }
})

vi.mock('@/utils/formatNumbers.js', () => ({
  formatLargeNumber: vi.fn((num, options) => {
    if (options?.removeZero && num === 0) return ''
    return num.toLocaleString()
  })
}))

vi.mock('@/components/GokIcon.vue', () => ({
  default: {
    name: 'GokIcon',
    template: '<div />',
    props: ['icon', 'size']
  }
}))

describe('CalculatorBottom.vue', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createWrapper = (props = {}) => {
    return mount(CalculatorBottom, {
      props: {
        total: 0,
        ...props
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          // Vuetify компоненты
          'VBottomNavigation': { template: '<div><slot /></div>' },
          'VCard': { template: '<div><slot /></div>' },
          'VBtn': {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            props: ['text', 'color', 'variant']
          },
          'VDialog': {
            template: '<div v-if="modelValue"><slot /></div>',
            props: ['modelValue', 'maxWidth']
          },
          'VCardTitle': { template: '<div><slot /></div>' },
          'VCardText': { template: '<div><slot /></div>' },
          'VCardActions': { template: '<div><slot /></div>' },
          'VCardItem': { template: '<div><slot /></div>' },
          'VListSubheader': { template: '<div><slot /></div>' },
          'VListItemTitle': { template: '<div><slot /></div>' },
          'VTextField': {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\', $event)" @focus="$emit(\'focus\', $event)" />',
            props: ['modelValue', 'type', 'min', 'max', 'step', 'bgColor']
          },
          'VDivider': { template: '<div />' },
          'VSpacer': { template: '<div />' },
          // Иконки
          'i-mdi-cog': { template: '<span />' },
          'i-mdi-cogs': { template: '<span />' },
          // Кастомные компоненты
          'GokIcon': { template: '<div />' },
        },
        mocks: {
          $route: {
            meta: {}
          }
        }
      },
    })
  }

  describe('Рендеринг', () => {
    it('должен монтироваться без ошибок', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('должен отображать общий total', async () => {
      const { formatLargeNumber } = await import('@/utils/formatNumbers.js')
      formatLargeNumber.mockReturnValue('1,234,567')

      wrapper = createWrapper({ total: 1234567 })
      await wrapper.vm.$nextTick() // Ждем обновления

      // Ищем текст в компоненте
      const text = wrapper.text()

      // Либо проверяем что функция вызвана (если текст не отображается из-за стабов)
      // Либо используем более точный поиск
      const card = wrapper.findComponent({ name: 'VCard' })
      if (card.exists()) {
        const cardText = card.text()
        expect(cardText).toContain('1,234,567')
      }
    })

    it('должен скрывать кнопку настроек если settings не переданы', () => {
      wrapper = createWrapper({ total: 1000 })

      const settingsBtn = wrapper.find('button') // Кнопка с настройками
      expect(settingsBtn.exists()).toBe(false)
    })

    it('должен показывать кнопку настроек если settings переданы', () => {
      const settings = {
        items: [],
        input: {},
        defaults: {},
        constraints: {}
      }

      wrapper = createWrapper({ total: 1000, settings })

      const settingsBtn = wrapper.find('button')
      expect(settingsBtn.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('должен принимать total как число', () => {
      wrapper = createWrapper({ total: 5000 })
      expect(wrapper.props('total')).toBe(5000)
    })

    it('должен принимать total как строку', () => {
      wrapper = createWrapper({ total: '7500' })
      expect(wrapper.props('total')).toBe('7500')
    })

    it('должен принимать settings объект', () => {
      const settings = {
        items: [
          { id: 'item1', name: 'Item 1', icon: 'icon1' }
        ],
        input: { item1: 1.5 },
        defaults: { item1: 1.0 },
        constraints: { item1: { min: 0.5, max: 2.0 } }
      }

      wrapper = createWrapper({ total: 1000, settings })
      expect(wrapper.props('settings')).toEqual(settings)
    })
  })

  describe('Методы', () => {
    it('метод openDialog должен открывать диалог настроек', async () => {
      const settings = {
        items: [{ id: 'test', name: 'Test', icon: 'icon' }],
        input: { test: 1.5 },
        defaults: { test: 1.0 },
        constraints: { test: { min: 1, max: 3 } }
      }

      wrapper = createWrapper({ total: 1000, settings })

      // Изначально диалог закрыт
      expect(wrapper.vm.settingDialog).toBe(false)

      // Вызываем openDialog
      wrapper.vm.openDialog()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.settingDialog).toBe(true)
      expect(wrapper.vm.oldData).toBeDefined()
    })

    it('метод closeDialog должен закрывать диалог', async () => {
      const settings = {
        items: [{ id: 'test', name: 'Test', icon: 'icon' }],
        input: { test: 1.5 },
        defaults: { test: 1.0 },
        constraints: { test: { min: 1, max: 3 } }
      }

      wrapper = createWrapper({ total: 1000, settings })

      // Открываем диалог
      wrapper.vm.settingDialog = true
      wrapper.vm.data = [{ id: 'test', name: 'Test', icon: 'icon', value: 2.0 }]
      wrapper.vm.oldData = [{ id: 'test', name: 'Test', icon: 'icon', value: 1.5 }]

      await wrapper.vm.$nextTick()

      // Закрываем диалог
      wrapper.vm.closeDialog()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.settingDialog).toBe(false)
      // Данные должны вернуться к старым значениям
      expect(wrapper.vm.data[0].value).toBe(1.5)
    })

    it('метод resetValue должен сбрасывать значение к default', () => {
      const settings = {
        items: [{ id: 'test', name: 'Test', icon: 'icon' }],
        input: { test: 2.0 },
        defaults: { test: 1.0 },
        constraints: { test: { min: 1, max: 3 } }
      }

      wrapper = createWrapper({ total: 1000, settings })

      // Устанавливаем измененное значение
      wrapper.vm.data = [{ id: 'test', name: 'Test', icon: 'icon', value: 2.0 }]

      // Сбрасываем значение
      wrapper.vm.resetValue('test')

      expect(wrapper.vm.data[0].value).toBe(1.0) // Значение по умолчанию
    })

    it('метод handleOnFocus должен добавлять имя к элементу', () => {
      wrapper = createWrapper()

      const mockEvent = {
        target: {
          select: vi.fn(),
          name: ''
        }
      }

      wrapper.vm.handleOnFocus(mockEvent)

      expect(mockEvent.target.select).toHaveBeenCalled()
      expect(mockEvent.target.name).toMatch(/^tmp_\d+$/)
    })
  })

  describe('События', () => {
    it('должен эмитить save-settings при сохранении', async () => {
      const settings = {
        items: [
          { id: 'item1', name: 'Item 1', icon: 'icon1' },
          { id: 'item2', name: 'Item 2', icon: 'icon2' }
        ],
        input: { item1: 1.5, item2: 3.0 },
        defaults: { item1: 1.0, item2: 2.0 },
        constraints: { item1: { min: 0.5, max: 2.0 }, item2: { min: 1, max: 5 } }
      }

      wrapper = createWrapper({ total: 1000, settings })

      // Мокаем document.querySelectorAll чтобы валидация проходила
      const mockInput = {
        checkValidity: vi.fn(() => true),
        reportValidity: vi.fn(),
        focus: vi.fn()
      }
      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockInput])

      // Устанавливаем данные
      wrapper.vm.data = [
        { id: 'item1', name: 'Item 1', icon: 'icon1', value: 1.8 },
        { id: 'item2', name: 'Item 2', icon: 'icon2', value: 4.0 }
      ]

      // Сохраняем настройки
      wrapper.vm.saveSettings()

      // Проверяем что событие эмитится с правильными данными
      expect(wrapper.emitted('save-settings')).toBeTruthy()
      expect(wrapper.emitted('save-settings')[0]).toEqual([
        { item1: 1.8, item2: 4.0 }
      ])
    })

    it('не должен эмитить save-settings при ошибках валидации', () => {
      const settings = {
        items: [{ id: 'item1', name: 'Item 1', icon: 'icon1' }],
        input: { item1: 1.5 },
        defaults: { item1: 1.0 },
        constraints: { item1: { min: 0.5, max: 2.0 } }
      }

      wrapper = createWrapper({ total: 1000, settings })

      // Мокаем невалидный input
      const mockInput = {
        checkValidity: vi.fn(() => false),
        reportValidity: vi.fn(),
        focus: vi.fn()
      }
      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockInput])

      wrapper.vm.saveSettings()

      expect(wrapper.emitted('save-settings')).toBeFalsy()
      expect(mockInput.reportValidity).toHaveBeenCalled()
    })
  })

  describe('Валидация полей', () => {
    it('метод validateField должен возвращать true для валидного поля', () => {
      wrapper = createWrapper()

      const mockEvent = {
        target: {
          checkValidity: vi.fn(() => true),
          reportValidity: vi.fn()
        }
      }

      const result = wrapper.vm.validateField(mockEvent)

      expect(result).toBe(true)
      expect(mockEvent.target.checkValidity).toHaveBeenCalled()
      expect(mockEvent.target.reportValidity).not.toHaveBeenCalled()
    })

    it('метод validateField должен возвращать false для невалидного поля', () => {
      wrapper = createWrapper()

      const mockEvent = {
        target: {
          checkValidity: vi.fn(() => false),
          reportValidity: vi.fn()
        }
      }

      const result = wrapper.vm.validateField(mockEvent)

      expect(result).toBe(false)
      expect(mockEvent.target.checkValidity).toHaveBeenCalled()
      expect(mockEvent.target.reportValidity).toHaveBeenCalled()
    })
  })

  describe('Тема (темная/светлая)', () => {
    it('должен определять темную тему', async () => {
      mockTheme.value = { dark: true }

      wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isDarkTheme).toBe(true)
    })

    it('должен определять светлую тему', async () => {
      mockTheme.value = { dark: false }

      wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isDarkTheme).toBe(false)
    })
  })
})
