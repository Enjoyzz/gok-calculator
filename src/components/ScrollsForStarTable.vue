<script setup>
import {useDisplay} from 'vuetify';
import str101 from '@/assets/stars/101.png';
import str102 from '@/assets/stars/102.png';
import str103 from '@/assets/stars/103.png';
import str104 from '@/assets/stars/104.png';
import str105 from '@/assets/stars/105.png';
import str106 from '@/assets/stars/106.png';
import str1000 from '@/assets/stars/1000.png';
import str1005 from '@/assets/stars/1005.png';

const {smAndUp} = useDisplay();

const scrollRows = [
  [7, 8, 10, 10, 15],
  [20, 25, 30, 30, 45],
  [45, 55, 70, 70, 110],
  [85, 110, 130, 130, 195],
];

const computedRows = computed(() => {
  return scrollRows.map(i => {
    return {
      scrolls: i,
      summary: i.reduce((a, b) => a + b, 0),
    };
  });
});

const allSummary = computed(() => {
  return computedRows.value.map(i => i.summary).reduce((a, b) => a + b, 0);
});
</script>

<template>
  <div>
    <v-table
      fixed-header
      max-height="500px"
      density="comfortable"
      hover
    >
      <thead>
      <tr>
        <th :style="{}" class=""></th>
        <th v-for="(headIcon, i) in [str101, str102, str103, str104, str106]" :key="i" class="text-center" :style="{}">
          <v-img :src="headIcon" width="30" height="30" class="d-inline-flex"/>
        </th>
        <th class="border-s border-e text-center" :style="{}">
          <v-img :src="str105" width="32" height="32" class="d-inline-flex"/>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, i) in computedRows" :key="i">
        <td class="text-no-wrap" v-if="smAndUp">
          <v-img v-for="n in 5" :key="n"
                 :src="i+2 >= n ? str1005 : str1000"
                 width="18"
                 height="18"
                 inline
                 :style="{}"
          />
        </td>
        <td class="text-no-wrap " v-else>
          <div class="d-flex align-center ga-0">
          <div class="font-weight-bold">{{ i + 2 }}</div>
          <v-img :src="str1005"
                 width="20"
                 height="20"
                 :style="{}"
          />
          </div>
        </td>
        <td v-for="(scroll, i) in row.scrolls" :key="i" class="text-center"><span>{{ scroll }}</span></td>
        <td class="font-weight-bold text-center border-s border-e">{{ row.summary }}</td>
      </tr>
      <tr class="text-h6">
        <td colspan="6" class="text-right">Всего</td>
        <td class="text-center border-s border-e border-b">{{ allSummary }}</td>
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
</style>
