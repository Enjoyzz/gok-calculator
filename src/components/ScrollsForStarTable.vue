<script setup>
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import IconCheck from '~icons/mdi/check'
  import str101 from '@/assets/stars/101.png'
  import str102 from '@/assets/stars/102.png'
  import str103 from '@/assets/stars/103.png'
  import str104 from '@/assets/stars/104.png'
  import str105 from '@/assets/stars/105.png'
  import str106 from '@/assets/stars/106.png'
  import str1000 from '@/assets/stars/1000.png'
  import str1005 from '@/assets/stars/1005.png'
  import IconCongrats from '@/assets/emoji/spt_800_131.png'

  const { smAndUp } = useDisplay()

  const scrollRows = [
    [7, 8, 10, 10, 15],
    [20, 25, 30, 30, 45],
    [45, 55, 70, 70, 110],
    [85, 110, 130, 130, 195],
  ]

  const startPosition = ref({ row: 0, position: 0 })

  const computedRows = computed(() => {
    return scrollRows.map((row, rowIndex) => {
      let startPos = 0

      if (rowIndex === startPosition.value.row) {
        startPos = startPosition.value.position
      } else if (rowIndex > startPosition.value.row) {
        startPos = 0
      } else {
        return {
          scrolls: row,
          summary: 0,
          isActive: false,
        }
      }

      const summary = row.slice(startPos).reduce((a, b) => a + b, 0)

      return {
        scrolls: row,
        summary: summary,
        startPosition: startPos,
      }
    })
  })

  const allSummary = computed(() => {
    return computedRows.value.map(i => i.summary).reduce((a, b) => a + b, 0)
  })

  function setStartPosition (row, position) {
    if (startPosition.value.row === row && startPosition.value.position === position) {
      startPosition.value = { row: 0, position: 0 }
      return
    }
    startPosition.value = { row: row, position: position }
  }

</script>

<template>
  <div>
    <v-table
      density="comfortable"
      hover
      style="max-width: 1200px"
    >
      <template #top>
        <v-card-title class="text-wrap">Количество свитков на звезды</v-card-title>
        <v-card-subtitle class="text-wrap">Чтобы прокачать советника "с нуля" до 5 звезд, необходимо всего в общей сумме
          (персональные и универсальные) 1200 свитков. Универсальные свитки такого же качества (цвета), что и советник
        </v-card-subtitle>
        <v-card-subtitle class="mt-3 text-wrap">Можно выбрать позицию с которой считать свитки, пропуская уже закрытые звезды и лучи.
          Для выбора нажмите в таблице нужную позицию (при повторном нажатии по той же позиции, установка сбросится по умолчанию, т.е. ничего закрыто)
        </v-card-subtitle>
        <v-spacer class="my-5" />
      </template>
      <thead>
        <tr>
          <th class="" :style="{}" />
          <th v-for="(headIcon, i) in [str101, str102, str103, str104, str106]" :key="i" class="text-center" :style="{}">
            <v-img class="d-inline-flex" height="30" :src="headIcon" width="30" />
          </th>
          <th class="border-s border-e text-center" :style="{}">
            <v-img class="d-inline-flex" height="32" :src="str105" width="32" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in computedRows" :key="rowIndex">
          <td v-if="smAndUp" class="text-no-wrap">
            <v-img
              v-for="n in 5"
              :key="n"
              height="18"
              inline
              :src="rowIndex+2 >= n ? str1005 : str1000"
              :style="{}"
              width="18"
            />
          </td>
          <td v-else class="text-no-wrap ">
            <div class="d-flex align-center ga-0">
              <div class="font-weight-bold">{{ rowIndex + 2 }}</div>
              <v-img
                height="20"
                :src="str1005"
                :style="{}"
                width="20"
              />
            </div>
          </td>
          <td
            v-for="(scroll, colIndex) in row.scrolls"
            :key="colIndex"
            class="text-center"
            :class="{
              'cursor-pointer': true,
              'text-decoration-line-through text-grey': rowIndex < startPosition.row || (rowIndex === startPosition.row && colIndex < startPosition.position)
            }"
            @click="setStartPosition(rowIndex, colIndex+1)"
          >
            <span>{{ scroll }}</span>
          </td>
          <td class="font-weight-bold text-center border-s border-e">
            <v-icon
              v-if="row.summary === 0"
              class="ml-1"
              color="success"
              :icon="IconCheck"
              size="24"
            />
            <span v-else>{{ row.summary }}</span>
          </td>
        </tr>
        <tr class="text-h6">
          <td class="text-right font-weight-bold text-body-large"" colspan="6">Всего</td>
          <td class="text-center border-s border-e border-b">

              <v-img
                v-if="allSummary === 0"
                inline
                width="32"
                :src="IconCongrats"
              />

            <span v-else class="font-weight-bold text-body-large">{{ allSummary }}</span>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped lang="css">
.v-table > .v-table__wrapper > table > tbody > tr > td,
.v-table > .v-table__wrapper > table > tbody > tr > th,
.v-table > .v-table__wrapper > table > thead > tr > td,
.v-table > .v-table__wrapper > table > thead > tr > th,
.v-table > .v-table__wrapper > table > tfoot > tr > td,
.v-table > .v-table__wrapper > table > tfoot > tr > th {
  padding: 0 8px;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(33, 150, 243, 0.05);
}

.bg-primary-lighten-4 {
  background-color: rgba(33, 150, 243, 0.12) !important;
}
</style>
