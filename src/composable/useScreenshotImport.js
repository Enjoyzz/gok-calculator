// src/composable/useScreenshotImport.js
// Разбор скриншота склада: сетка 4 колонки → матчинг иконок → OCR количества.

const SIZE = 48          // размер миниатюры для сравнения (мелкие эмблемы на свитках теряются при 32)
const WEAK_DIFF = 20     // совпадения хуже этого score помечаются как сомнительные
const DISC = 60          // пиксель «различающий», если кандидаты в нём расходятся по цвету сильнее этого (сумма RGB)
const MIN_PIXELS = 20    // минимум различающих пикселей для уверенного решения
const MAX_DIFF = 36      // порог схожести (0 — идентично, 255 — противоположно); подберите по логам
const PAD = 0.1          // срез рамки ячейки (и у эталона, и у скриншота)
const MIN_RATIO = 0.85   // лучший кандидат должен быть заметно лучше второго, иначе считаем неоднозначным
const COLS = 4
const GRID = { x0: 0.0222, cell: 0.2111, step: 0.2463 } // доли от ширины скриншота

let ocrWorker = null

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function pixels(source, sx, sy, sw, sh, w = SIZE, h = SIZE) {
  const ctx = makeCanvas(w, h).getContext('2d', { willReadFrequently: true })
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, w, h)
  return ctx.getImageData(0, 0, w, h).data
}

// --- геометрия сетки ---

function columns(W) {
  const cell = GRID.cell * W
  return Array.from({ length: COLS }, (_, i) => ({ x: (GRID.x0 + i * GRID.step) * W, cell }))
}

// Строки ищем по вертикальному профилю: внутри ячейки цвет насыщенный/тёмный, фон склада — светло-бежевый
function findRows(img, cols) {
  const { width: W, height: H } = img
  const data = pixels(img, 0, 0, W, H, W, H)
  const cell = cols[0].cell
  const probes = cols.flatMap(c => [c.x + cell * 0.15, c.x + cell * 0.85].map(Math.round))

  const inside = y => {
    let votes = 0
    for (const x of probes) {
      const i = (y * W + x) * 4
      const r = data[i], g = data[i + 1], b = data[i + 2]
      if (Math.max(r, g, b) - Math.min(r, g, b) > 40 || Math.max(r, g, b) < 110) votes++
    }
    return votes >= probes.length * 0.6
  }

  const isCellRun = len => len >= cell * 0.9 && len <= cell * 1.15

  const rows = []
  let start = null
  let gap = 0
  const maxGap = W * 0.012
  for (let y = 0; y < H; y++) {
    if (inside(y)) {
      if (start === null) start = y
      gap = 0
    } else if (start !== null && ++gap > maxGap) {
      const end = y - gap
      if (isCellRun(end - start)) rows.push(start) // обрезанные строки и шапку (высокая тёмная полоса) пропускаем
      start = null
      gap = 0
    }
  }
  if (start !== null && isCellRun(H - start)) rows.push(start)
  return rows
}

// --- матчинг иконок ---

function diff(cell, ref) {
  let sum = 0
  let n = 0
  for (let i = 0; i < SIZE * SIZE; i++) {
    if (ref[i * 4 + 3] < 200) continue // только непрозрачные пиксели эталона (фон ячейки игнорируем)
    const px = i % SIZE
    const py = (i / SIZE) | 0
    if (px > SIZE * 0.4 && py > SIZE * 0.62) continue // зона с числом
    sum += Math.abs(cell[i * 4] - ref[i * 4]) +
      Math.abs(cell[i * 4 + 1] - ref[i * 4 + 1]) +
      Math.abs(cell[i * 4 + 2] - ref[i * 4 + 2])
    n++
  }
  return n ? sum / n / 3 : Infinity
}

// Эталон = фон (bg) + иконка (src), как их собирает GokIcon, с тем же срезом рамки, что и у ячейки
// Повторяет вёрстку GokIcon: квадрат, фон background-size: cover, img растянут на весь квадрат
async function renderRef({ src, bg }) {
  const FULL = 96
  const full = makeCanvas(FULL, FULL).getContext('2d')

  if (bg) {
    const img = await loadImage(bg)
    const s = Math.max(FULL / img.naturalWidth, FULL / img.naturalHeight) // cover
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    full.drawImage(img, (FULL - dw) / 2, (FULL - dh) / 2, dw, dh)
  }
  full.drawImage(await loadImage(src), 0, 0, FULL, FULL)

  const ctx = makeCanvas(SIZE, SIZE).getContext('2d', { willReadFrequently: true })
  ctx.drawImage(full.canvas, FULL * PAD, FULL * PAD, FULL * (1 - PAD * 2), FULL * (1 - PAD * 2), 0, 0, SIZE, SIZE)
  return ctx.getImageData(0, 0, SIZE, SIZE).data
}

// Похожие предметы (свитки на одинаковом фоне) почти целиком совпадают, различается только эмблема.
// Поэтому среди близких кандидатов сравниваем ячейку лишь в тех пикселях, где кандидаты расходятся.
function tieBreak(cell, cands) {
  const totals = cands.map(() => 0)
  let used = 0

  for (let i = 0; i < SIZE * SIZE; i++) {
    if (i % SIZE > SIZE * 0.4 && ((i / SIZE) | 0) > SIZE * 0.62) continue // зона числа
    const o = i * 4
    const mean = [0, 1, 2].map(ch => cands.reduce((s, c) => s + c.data[o + ch], 0) / cands.length)
    const spread = Math.max(...cands.map(c =>
      Math.abs(c.data[o] - mean[0]) + Math.abs(c.data[o + 1] - mean[1]) + Math.abs(c.data[o + 2] - mean[2])))
    if (spread < DISC) continue

    used++
    cands.forEach((c, k) => {
      totals[k] += Math.abs(cell[o] - c.data[o]) + Math.abs(cell[o + 1] - c.data[o + 1]) + Math.abs(cell[o + 2] - c.data[o + 2])
    })
  }

  const order = totals.map((t, k) => ({ k, t })).sort((a, b) => a.t - b.t)
  const [a, b] = order
  const winner = cands[a.k]
  if (used < MIN_PIXELS || a.t > b.t * MIN_RATIO) return { id: null, score: winner.score, ambiguous: cands.map(c => c.id) }
  return { id: winner.id, own: winner.own, score: winner.score }
}

function matchItem(img, x, y, cell, refs) {
  const pad = cell * PAD
  const data = pixels(img, x + pad, y + pad, cell - pad * 2, cell - pad * 2)
  const ranked = refs
    .map(r => ({ id: r.id, own: r.own, data: r.data, score: diff(data, r.data) }))
    .sort((a, b) => a.score - b.score)

  const best = ranked[0]
  if (!best || best.score > MAX_DIFF) return { id: null, score: best?.score } // чужой предмет

  const close = ranked.filter(c => c.score <= best.score * 1.5 + 5).slice(0, 4)
  if (close.length === 1) return { id: best.id, own: best.own, score: best.score }
  return tieBreak(data, close)
}

// --- OCR ---

async function getWorker() {
  if (!ocrWorker) {
    const { createWorker } = await import('tesseract.js') // подгружается лениво
    ocrWorker = await createWorker('eng')
    await ocrWorker.setParameters({
      tessedit_char_whitelist: '0123456789',
      tessedit_pageseg_mode: '7', // одна строка
    })
  }
  return ocrWorker
}

// Белый текст с тёмной обводкой → чёрный текст на белом
function countCanvas(img, x, y, cell) {
  const sx = x + cell * 0.3
  const sy = y + cell * 0.72
  const sw = cell * 0.65
  const sh = cell * 0.25
  const scale = 4
  const canvas = makeCanvas(Math.round(sw * scale), Math.round(sh * scale))
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
  const im = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < im.data.length; i += 4) {
    const white = im.data[i] > 190 && im.data[i + 1] > 190 && im.data[i + 2] > 190
    const v = white ? 0 : 255
    im.data[i] = im.data[i + 1] = im.data[i + 2] = v
  }
  ctx.putImageData(im, 0, 0)
  return canvas
}

async function readCount(img, x, y, cell) {
  const worker = await getWorker()
  const { data } = await worker.recognize(countCanvas(img, x, y, cell))
  const n = parseInt(data.text.replace(/\D/g, ''), 10)
  return Number.isNaN(n) ? null : n
}

export async function terminateOcr() {
  await ocrWorker?.terminate()
  ocrWorker = null
}

/**
 * @param {File[]} files
 * @param {{id: string, src: string}[]} items  эталоны (id предмета + путь к иконке)
 * @returns {{counts: Record<string, number>, unknown: number}}
 */
export async function parseWarehouse(files, items, onProgress = () => {}, decoys = []) {
  // decoys — предметы других калькуляторов: участвуют в сравнении, но в результат не попадают.
  // Так чужой свиток на том же фоне находит «свою» ближайшую иконку и отбрасывается.
  const refs = await Promise.all([
    ...items.map(async it => ({ id: it.id, own: true, data: await renderRef(it) })),
    ...decoys.map(async it => ({ id: it.id, own: false, data: await renderRef(it) })),
  ])

  const found = {}
  let unknown = 0

  for (const [fi, file] of files.entries()) {
    const bitmap = await createImageBitmap(file)
    const cols = columns(bitmap.width)
    const rows = findRows(bitmap, cols)

    for (const y of rows) {
      for (const { x, cell } of cols) {
        const m = matchItem(bitmap, x, y, cell, refs)
        console.debug('match', m)
        if (!m.id || !m.own) { unknown++; continue } // чужой предмет — не считаем ошибкой
        // один id может встретиться несколько раз (в т.ч. чужой предмет, похожий на свой) — берём совпадение с лучшим score
        if (found[m.id] && found[m.id].score <= m.score) continue
        const n = await readCount(bitmap, x, y, cell)
        if (n != null) found[m.id] = { n, score: m.score }
      }
    }
    onProgress((fi + 1) / files.length)
  }

  const counts = Object.fromEntries(Object.entries(found).map(([id, f]) => [id, f.n]))
  const weak = Object.keys(found).filter(id => found[id].score > WEAK_DIFF) // стоит перепроверить глазами
  return { counts, weak, unknown }
}
