<script>
export default {
  name: 'CharmItem',
  props: {
    item: Object,
    value: Number,
    total: Number
  },
  emits: ['update']
}
</script>

<template>
  <tr>
    <td class="icon">
      <div :class="'bg'" :style="{backgroundImage:  `url(${item.bgColor})`}">
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
    <td>{{ total }}</td>
  </tr>
</template>

<style scoped>

</style>