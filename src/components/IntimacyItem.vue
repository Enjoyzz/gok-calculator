<template>
  <tr>
    <td class="icon">
      <div :class="['bg']" :style="{backgroundImage:  `url(${item.bgColor})`}">
        <img :src="item.icon" :alt="item.name">
      </div>
    </td>
    <td>
      {{ item.name }}<br>
      <small class="text-muted">{{ item.description }}</small>
    </td>
    <td class="input-cell">
      <input
          type="number"
          :value="value"
          @input="$emit('update', item.id, Math.max(0, parseInt($event.target.value) || 0))"
          min="0"
      >
    </td>
    <td style="text-wrap: nowrap">{{ item.approximately === true ? '~ ' : ''}}{{ total }}</td>
  </tr>
</template>

<script>
export default {
  name: 'IntimacyItem',
  props: {
    item: Object,
    value: Number,
    total: Number
  },
  emits: ['update']
}
</script>