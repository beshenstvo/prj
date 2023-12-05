<template>
  <div class="container mb-4" style="width: 50%" v-if="portfoliosChartData && portfoliosChartData.length > 0">
    <div v-for="(portfolio, index) in portfoliosChartData" :key="index" class="mb-4">
      <h3>Портфель #{{ index + 1 }}</h3>

      <div class="mb-3">
        <div style="text-align: start;"><label for="budget" class="form-label">Бюджет:</label></div>
        <div><input class="form-control" type="text" id="budget" v-model="budget" @input="formatBudget"></div>
      </div>

    
      <div style="text-align: start;"><label for="rebalance-period" class="form-label">Период ребалансировки:</label></div>
      <div class="input-group mb-3">
      <select class="form-select" id="rebalance-period" v-model="rebalancePeriod">
          <option value="weekly">Недельная</option>
          <option value="biweekly">Двухнедельная</option>
          <option value="monthly" selected>Месячная</option>
          <option value="quarterly">Квартальная</option>
          <option value="semiannual">Полугодовая</option>
          <option value="annual">Годовая</option>
      </select>
      </div>

      <div v-for="(tickerData, ticker) in portfolio.tickers" :key="ticker" class="d-flex justify-content-left mb-2">
        <div style="align-self: center;"><label style="width:100px; text-align: left;" :for="`weight-${ticker}`">{{ ticker }}</label></div>
        <div><input class="form-control" type="number" :id="`weight-${ticker}`" v-model="tickerData.weight" min="0"></div>
      </div>

      <div class="mb-3">
        <div style="text-align: start;"><label for="max-drawdown" class="form-label" min="0">Максимальная просадка (%):</label></div>
        <div><input class="form-control" type="number" id="max-drawdown" v-model="maxDrawdown"></div>
      </div>

    </div>


    <button class="btn btn-outline-primary" @click="rebalancePortfolio">Подсчитать</button>

    <!-- Здесь будет отображаться график -->
  </div>
  <div v-else>
    Данные для ребалансировки не найдены!
  </div>
</template>

<script>
export default {
  data() {
    return {
      rebalancePeriod: 'monthly',
      budget: 1000000,
      maxDrawdown: 5, 
      portfoliosChartData: null
    };
  },
  computed: {
    chartData() {
      console.log('Данные есть вообще ' + this.$store.state.chartData);
      return this.$store.state.chartData;
    }
  },
  watch: {
    chartData: {
      immediate: true,
      handler(newData) {
        this.portfoliosChartData = this.prepareChartData(newData);
      }
    }
  },
  methods: {
    prepareChartData(data) {
      // Подготавливаем данные для каждого портфеля
      return Object.values(data).map(portfolio => {
        // Добавляем свойство веса для каждого тикера
        Object.keys(portfolio.tickers).forEach(ticker => {
          portfolio.tickers[ticker] = { ...portfolio.tickers[ticker], weight: 0 };
        });
        return portfolio;
      });
    }
  }
};
</script>

<style>
.rebalance-component .input-group {
  margin-bottom: 1em;
}

.rebalance-component label {
  display: block;
}

.rebalance-component input[type="number"] {
  width: 100%;
}
</style>
