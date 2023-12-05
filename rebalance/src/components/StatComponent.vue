<template>
  <div>
    <h1>Месячная статистика цен</h1>
    <ul>
      <li v-for="(stat, month) in monthlyStatistics" :key="month">
        <strong>{{ getMonthName(month) }}:</strong>
        <p>Рост цен: {{ stat.increase }} месяцев</p>
        <p>Падение цен: {{ stat.decrease }} месяцев</p>
        <p>Среднее изменение цены: {{ stat.averageChange.toFixed(2) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    monthlyStatistics() {
      return this.$store.getters.monthlyStatistics;
    }
  },
  methods: {
    getMonthName(monthIndex) {
      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 
        'Май', 'Июнь', 'Июль', 'Август', 
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      return months[monthIndex];
    }
  }
};
</script>
