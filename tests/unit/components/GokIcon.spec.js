import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GokIcon from '@/components/GokIcon.vue'

// Простые моки без сложной логики
vi.mock('vuetify', () => ({
  createVuetify: () => ({
    install: vi.fn(),
  })
}))

vi.mock('vuetify/framework', () => ({
  useTheme: vi.fn(() => ({
    current: {
      value: { dark: false }
    }
  }))
}))

// Мокаем console.warn
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('GokIcon.vue - бизнес-логика', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    consoleWarnSpy.mockClear()
  })

  const createWrapper = (props = {}) => {
    return mount(GokIcon, {
      props,
      global: {
        stubs: {},
      }
    })
  }

  describe('Валидация пропсов', () => {
    it('должен показывать предупреждение если нет icon и src', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'GokIcon component -  need set :icon or :src props. The icon props must be object {src:String, bg:?String}'
      )
      expect(wrapper.vm.validProps).toBe(false)
    })

    it('должен быть valid если есть icon.src', async () => {
      wrapper = createWrapper({ icon: { src: '/test.png' } })
      await wrapper.vm.$nextTick()

      // Просто проверяем значение validProps
      expect(wrapper.vm.validProps).toBe(true)
      // console.warn проверять не нужно - валидность определяется через validProps
    })

    it('должен быть valid если есть src', async () => {
      wrapper = createWrapper({ src: '/test.png' })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.validProps).toBe(true)
    })
  })

  describe('Вычисляемые свойства', () => {
    it('iconPath должен возвращать icon.src', async () => {
      wrapper = createWrapper({ icon: { src: '/icon.png' } })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.iconPath).toBe('/icon.png')
    })

    it('iconPath должен возвращать src', async () => {
      wrapper = createWrapper({ src: '/direct.png' })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.iconPath).toBe('/direct.png')
    })

    it('backgroundStyle должен возвращать объект', async () => {
      wrapper = createWrapper({ icon: { src: '/i.png', bg: '/bg.png' } })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.backgroundStyle).toEqual({backgroundImage: 'url(/bg.png)'})
    })

    it('backgroundStyle должен возвращать объект', async () => {
      wrapper = createWrapper({ src: '/i.png', bg: '/bg.png' })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.backgroundStyle).toEqual({backgroundImage: 'url(/bg.png)'})
    })

    it('iconSize должен возвращать переданный size', async () => {
      wrapper = createWrapper({ icon: { src: '/i.png' }, size: 100 })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.iconSize).toBe(100)
    })

    it('iconSize должен возвращать 72 по умолчанию', async () => {
      wrapper = createWrapper({ icon: { src: '/i.png' } })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.iconSize).toBe(72)
    })

    it('iconSize должен возвращать 0 если size: 0', async () => {
      wrapper = createWrapper({ icon: { src: '/i.png' }, size: 0 })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.iconSize).toBe(0)
    })
  })

  describe('Пропсы', () => {
    it('должен принимать badge как строку', async () => {
      wrapper = createWrapper({ icon: { src: '/i.png' }, badge: 'NEW' })
      await wrapper.vm.$nextTick()

      expect(wrapper.props('badge')).toBe('NEW')
    })

    it('должен принимать badge как число', async () => {
      wrapper = createWrapper({ icon: { src: '/i.png' }, badge: 10 })
      await wrapper.vm.$nextTick()

      expect(wrapper.props('badge')).toBe(10)
    })

    it('должен принимать name', async () => {
      wrapper = createWrapper({ icon: { src: '/i.png' }, name: 'Меч' })
      await wrapper.vm.$nextTick()

      expect(wrapper.props('name')).toBe('Меч')
    })
  })
})
