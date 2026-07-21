import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollsForStarTable from '@/components/ScrollsForStarTable.vue'

vi.mock('~icons/mdi/check', () => ({ default: { template: '<span />' } }))

vi.mock('vuetify', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useDisplay: () => ({ smAndUp: { value: true } }),
  }
})

const SCROLL_ROWS = [
  [7, 8, 10, 10, 15],
  [20, 25, 30, 30, 45],
  [45, 55, 70, 70, 110],
  [85, 110, 130, 130, 195],
]

describe('ScrollsForStarTable', () => {
  let wrapper

  const createWrapper = () => {
    return mount(ScrollsForStarTable, {
      global: {
        stubs: {
          'v-table': { template: '<div><slot name="top" /><table><slot /></table></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-subtitle': { template: '<div><slot /></div>' },
          'v-spacer': { template: '<div />' },
          'v-img': { template: '<img :src="src" />', props: ['src', 'width', 'height'] },
          'v-icon': {
            template: '<span data-testid="v-icon"><slot /></span>',
            props: ['icon', 'size', 'color'],
          },
        },
      },
    })
  }

  // Клик по конкретной ячейке свитков: строка/колонка — индексы данных (0-based)
  const clickScroll = async (rowIndex, colIndex) => {
    const row = wrapper.findAll('tbody tr')[rowIndex]
    // первая td — иконки звёзд, дальше идут 5 ячеек свитков
    const cell = row.findAll('td')[colIndex + 1]
    await cell.trigger('click')
  }

  const rowSummary = rowIndex => {
    const cells = wrapper.findAll('tbody tr')[rowIndex].findAll('td')
    return cells.at(-1)
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('расчёт сумм', () => {
    it('изначально сумма по всем строкам равна 1200', () => {
      expect(wrapper.vm.allSummary).toBe(1200)
    })

    it('сумма каждой строки соответствует данным', () => {
      const rows = wrapper.vm.computedRows
      expect(rows.map(r => r.summary)).toEqual([50, 150, 350, 650])
    })
  })

  describe('выбор позиции кликом', () => {
    it('клик по ячейке помечает её и всё до неё как собранное, остаток — после неё', async () => {
      await clickScroll(1, 2) // строка "20 25 30 30 45", кликаем по первой 30 (индекс 2)
      expect(wrapper.vm.computedRows[1].summary).toBe(75) // 30+45 (индексы 3,4)
    })

    it('обнуляет более ранние строки', async () => {
      await clickScroll(2, 0) // индекс 0 в строке 2 тоже помечается собранным
      const rows = wrapper.vm.computedRows
      expect(rows[0].summary).toBe(0)
      expect(rows[1].summary).toBe(0)
      expect(rows[2].summary).toBe(305) // 55+70+70+110, без 45
      expect(rows[3].summary).toBe(650)
    })

    it('повторный клик по той же ячейке сбрасывает позицию', async () => {
      await clickScroll(0, 2) // индексы 0,1,2 (7+8+10) считаются собранными
      expect(wrapper.vm.allSummary).toBe(1175) // 1200 - (7+8+10)

      await clickScroll(0, 2)
      expect(wrapper.vm.allSummary).toBe(1200)
    })

    it('клик по последней ячейке последней строки закрывает всё', async () => {
      await clickScroll(3, 4)
      expect(wrapper.vm.allSummary).toBe(0)
    })

    it('клик по колонке итогов ничего не меняет', async () => {
      const before = wrapper.vm.allSummary
      const summaryCell = rowSummary(0)

      await summaryCell.trigger('click')

      expect(wrapper.vm.allSummary).toBe(before)
    })
  })

  describe('визуальное отображение', () => {
    it('зачёркивает пройденные ячейки', async () => {
      await clickScroll(1, 2)

      const firstRowCells = wrapper.findAll('tbody tr')[0].findAll('td')
      firstRowCells.slice(1, 6).forEach(cell => {
        expect(cell.classes()).toContain('text-decoration-line-through')
      })

      // startPosition.position = 3 после клика по colIndex=2 → зачёркнуты colIndex 0,1,2
      const secondRowCells = wrapper.findAll('tbody tr')[1].findAll('td')
      expect(secondRowCells[1].classes()).toContain('text-decoration-line-through') // colIndex 0
      expect(secondRowCells[2].classes()).toContain('text-decoration-line-through') // colIndex 1
      expect(secondRowCells[3].classes()).toContain('text-decoration-line-through') // colIndex 2 (кликнутая)
      expect(secondRowCells[4].classes()).not.toContain('text-decoration-line-through') // colIndex 3
    })

    it('показывает галочку вместо суммы, когда строка закрыта полностью', async () => {
      await clickScroll(0, 4)

      const summaryCell = rowSummary(0)
      expect(summaryCell.find('[data-testid="v-icon"]').exists()).toBe(true)
      expect(summaryCell.text()).not.toContain('15')
    })

    it('показывает картинку поздравления, когда общая сумма равна 0', async () => {
      // Со <script setup> wrapper.setData не работает (нет обычного $data),
      // поэтому для граничного случая "всё закрыто" зовём метод компонента напрямую.
      // Строки данных — 0..3, поэтому row:4 гарантированно ставит все rowIndex < row
      // и summary всех строк = 0.
      wrapper.vm.setStartPosition(4, 0)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.allSummary).toBe(0)
      const totalRow = wrapper.findAll('tbody tr').at(-1)
      const img = totalRow.find('img')
      expect(img.exists()).toBe(true)
    })
  })

  describe('целостность данных', () => {
    it('не мутирует исходный scrollRows', async () => {
      await clickScroll(1, 2)
      await clickScroll(2, 0)

      expect(wrapper.vm.scrollRows).toEqual(SCROLL_ROWS)
    })
  })
})