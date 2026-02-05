import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '@/utils/debounce.js'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('должен вызывать функцию только после задержки', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn('arg1', 'arg2')

    // Функция не должна быть вызвана сразу
    expect(mockFn).not.toHaveBeenCalled()

    // После 50мс - все еще не вызвана
    vi.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    // После 100мс - должна быть вызвана
    vi.advanceTimersByTime(50)
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('должен сбрасывать таймер при повторном вызове', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    // Первый вызов
    debouncedFn()
    vi.advanceTimersByTime(50) // Прошло 50мс

    // Второй вызов - должен сбросить таймер
    debouncedFn()

    // После еще 50мс (всего 100 с первого вызова, но таймер сброшен)
    vi.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled() // Все еще не должна быть вызвана

    // После еще 50мс (всего 100 со второго вызова)
    vi.advanceTimersByTime(50)
    expect(mockFn).toHaveBeenCalledTimes(1) // Теперь должна быть вызвана
  })

  it('должен сохранять контекст (this)', () => {
    const mockFn = vi.fn(function() {
      return this.value
    })

    const context = {
      value: 'test context',
      debouncedFn: debounce(mockFn, 100)
    }

    context.debouncedFn()
    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalled()
    // Проверяем что функция вызвана с правильным контекстом
    expect(mockFn.mock.instances[0]).toBe(context)
  })

  it('должен передавать все аргументы', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn(1, 2, 3)
    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledWith(1, 2, 3)
  })

  it('должен работать с разными задержками', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 500)

    debouncedFn()

    vi.advanceTimersByTime(250)
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(250)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('должен обрабатывать несколько последовательных вызовов', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)
    let callCount = 0

    // Симулируем быстрые последовательные вызовы
    const interval = setInterval(() => {
      debouncedFn(`call${++callCount}`)
    }, 50)

    // 5 вызовов с интервалом 50мс при дебаунсе 100мс
    vi.advanceTimersByTime(250) // 5 * 50мс

    clearInterval(interval)

    // После последнего вызова ждем задержку
    vi.advanceTimersByTime(100)

    // Должен быть только 1 вызов с последним аргументом
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call5')
  })

  it('должен корректно работать с нулевой задержкой', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 0)

    debouncedFn('test')

    // При нулевой задержке должна вызваться в следующем тике
    vi.advanceTimersByTime(0)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('должен корректно очищать предыдущий таймаут', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 100)

    // Мокаем clearTimeout чтобы убедиться что он вызывается
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    debouncedFn()
    debouncedFn() // Второй вызов должен очистить первый таймаут

    expect(clearTimeoutSpy).toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  describe('Интеграционные тесты', () => {
    it('должен предотвращать множественные вызовы при частых событиях', () => {
      const expensiveOperation = vi.fn()
      const debouncedOperation = debounce(expensiveOperation, 200)

      // Симулируем частые события (например, ввод в поле поиска)
      for (let i = 0; i < 10; i++) {
        debouncedOperation(`input${i}`)
        vi.advanceTimersByTime(50)
      }

      // После всех вызовов ждем задержку
      vi.advanceTimersByTime(200)

      // Должен быть только один вызов с последним значением
      expect(expensiveOperation).toHaveBeenCalledTimes(1)
      expect(expensiveOperation).toHaveBeenCalledWith('input9')
    })

    it('должен работать с методами объекта', () => {
      class SearchService {
        constructor() {
          this.search = debounce(this.performSearch.bind(this), 100)
          this.results = []
        }

        performSearch(query) {
          this.results.push(`result for: ${query}`)
        }
      }

      const service = new SearchService()

      service.search('test1')
      service.search('test2')
      service.search('test3')

      vi.advanceTimersByTime(100)

      expect(service.results).toEqual(['result for: test3'])
    })
  })

  describe('Граничные случаи', () => {
    it('должен работать с асинхронными функциями', async () => {
      const asyncFn = vi.fn(async () => 'result')
      const debouncedAsync = debounce(asyncFn, 100)

      const promise = debouncedAsync()
      vi.advanceTimersByTime(100)

      // Функция должна быть вызвана
      expect(asyncFn).toHaveBeenCalled()

      // Можно проверить результат если нужно
      // const result = await promise
      // expect(result).toBe('result')
    })

    it('должен корректно обрабатывать undefined и null как аргументы', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn(undefined)
      debouncedFn(null)

      vi.advanceTimersByTime(100)

      // Последний вызов с null
      expect(mockFn).toHaveBeenCalledWith(null)
    })
  })
})
