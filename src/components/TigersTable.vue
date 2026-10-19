<script setup>
import { ref, computed } from 'vue'

const rawData = ref([
  2, 2, 4, 4, 6, 6, 8, 8, 10, 10, // 401-410
  12, 14, 16, 18, 20, 22, 24, 26, 28, 30, // 411-420
  32, 34, 36, 38, 40, 44, 48, 52, 56, 60, // 421-430
  64, 68, 72, 76, 80, 84, 88, 92, 96, 100, // 431-440
  104, 108, 112, 116, 120, 124, 128, 132, 136, 140, // 441-450
  150, 160, 170, 180, 190, 200, 210, 220, 230, 240, // 451-460
  250, 260, 270, 280, 290, 300, 310, 320, 330, 340, // 461-470
  350, 360, 370, 380, 390, 400, 410, 420, 430, 440, // 471-480
  450, 460, 470, 480, 490, 500, 510, 520, 530, 540, // 481-490
  550, 560, 570, 580, 590, 600, 610, 620, 630, 640, // 491-500
])


const tableItems = computed(() => {
  let total = 0
  return rawData.value.map((count, index) => {
    total += count
    return {
      level: 401 + index, // Первый элемент — 401 уровень
      count: count,
      total: total
    }
  })
})

</script>

<template>
  <v-table  hover style="margin-bottom: 50px" density="compact">
    <thead>
    <tr>
      <th class="font-weight-bold">Уровень советника</th>
      <th class="font-weight-bold">Знаков для уровня</th>
      <th class="font-weight-bold">Общее количество знаков</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in tableItems" :key="item.level">
      <td>{{ item.level }}</td>
      <td>{{ item.count }}</td>
      <td class="font-weight-medium">{{ item.total }}</td>
    </tr>
    </tbody>
  </v-table>
</template>
