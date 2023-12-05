<template>
  <div class="container">
    <div v-if="portfoliosChartData.length == 0">
      Нет данных для отображения гистограммы!
    </div>
    <div v-for="(portfolioData, index) in portfoliosChartData" :key="index" class="mb-4">
      <h3>Портфель #{{ index + 1 }}</h3>
      <div><canvas :ref="'priceChangeChart-' + index" @click="event => handleChartClick(event, index)"></canvas></div>
      <!-- тут будет отображение движение графика цены -->
      <div v-if="selectedTickerData">
        <h2>График изменения цены</h2>
        <div><canvas :ref="'priceMovementChart-' + index"></canvas></div>
        <h2>Нормальное и реальное распределение</h2>
        <div><canvas :ref="'gaussaChart-' + index"></canvas></div>
      </div>
    </div>

  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-moment';
Chart.register(...registerables);
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

export default {
  data() {
    return {
      selectedTickerData: false,
      gaussaChart: null,
      priceMovementChart: null,
      portfoliosChartData: [],
      charts: [],
    };
  },
  computed: {
    chartData() {
      console.log('Данные есть вообще '+this.$store.state.chartData)
      return this.$store.state.chartData;
    }
  },
  watch: {
    chartData: {
      immediate: true,
      handler(newData) {
        if (!newData || newData.length === 0) {
          console.error('chartData is empty or not defined');
          this.portfoliosChartData = [];
        } else {
          console.log('Данные у ChartData ', newData)
          this.portfoliosChartData = this.prepareChartData(newData).filter(n => n);
          this.renderAllCharts();
        }
      }
    }
  },
  methods: {
  getTickerData(ticker, index) {
    console.log(this.chartData[0])
    if (!this.chartData || !this.chartData[index].tickers) {
      console.error('chartData or tickers is undefined');
      return { labels: [], data: [] };
    }

    // Проверяем, существует ли указанная бумага в tickers
    const tickerData = this.chartData[index].tickers[ticker];
    if (!tickerData) {
      console.error(`Ticker data for ${ticker} is undefined`);
      return { labels: [], data: [] };
    }
    
    // Если все проверки пройдены, извлекаем данные
    const labels = tickerData.map(entry => entry.date);
    const data = tickerData.map(entry => entry.close.num / Math.pow(10, entry.close.scale));
    return { labels, data };
  },
  renderGaussaChart(ticker, index) {
    if (this.gaussaChart) {
      this.gaussaChart.destroy();
    }
    const { labels, data } = this.getTickerData(ticker, index);
    // const { labels, data } = this.getTickerDataGaussa(ticker, index);

    console.log(labels);

    console.log()

    const logReturns = this.calculateLogReturns(data);
    const mean = this.calculateMean(logReturns);
    const standardDeviation = this.calculateStandardDeviation(logReturns, mean);

    const normalDistributionData = this.generateNormalDistributionData(logReturns, mean, standardDeviation);
    const percentLabels = data.map((value) =>
      ((value / data[0] - 1) * 100).toFixed(2) + "%"
    );


    this.$nextTick(() => {
      const refNameGaussa = `gaussaChart-${index}`;
      const canvasRef = this.$refs[refNameGaussa][0];

      if (!canvasRef) {
        console.error(`Canvas ref '${refNameGaussa}' not found.`);
        return;
      }
      const ctx = canvasRef.getContext('2d');

      // Рендеринг гистограммы и графика нормального распределения
      this.gaussaChart = new Chart(ctx, {
        type: 'bar', // Гистограмма для реальных данных
        data: {
          labels: percentLabels,
          datasets: [{
            label: 'Реальные данные',
            data: data,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            yAxisID: 'y-axis-1',
          }, {
            label: 'Нормальное распределение',
            data: normalDistributionData,
            type: 'line', // Линия для нормального распределения
            borderColor: 'red',
            fill: false,
            yAxisID: 'y-axis-2',
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Изменение в процентах',
              }
            },
            y: {
              title: {
                display: true,
                text: 'Плотность',
              }
            },
          },
        }
      });
    });
  },

  generateNormalDistributionData(data, mean, standardDeviation) {
    return data.map(value => {
      return (1 / (standardDeviation * Math.sqrt(2 * Math.PI))) 
            * Math.exp(-Math.pow(value - mean, 2) / (2 * Math.pow(standardDeviation, 2)));
    });
  },

  calculateLogReturns(prices) {
    let logReturns = [];
    for (let i = 1; i < prices.length; i++) {
      logReturns.push(Math.log(prices[i] / prices[i-1]));
    }
    return logReturns;
  },
  calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  },
  calculateStandardDeviation(data, mean) {
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
  },
  renderPriceMovementChart(ticker, index) {
    if (this.priceMovementChart) {
      this.priceMovementChart.destroy(); 
    }
    const { labels, data } = this.getTickerData(ticker, index);

    console.log('labels: ' + labels, ', data: ' + data);

    this.$nextTick(() => {
      const refNameSecond = `priceMovementChart-${index}`;
      console.log(`priceMovementChart-${index} `,this.$refs[refNameSecond][0])
      const canvasRef = this.$refs[refNameSecond][0];
      
      if (!canvasRef) {
        console.error(`Canvas ref '${refNameSecond}' not found.`);
        return;
      }
      const ctx = canvasRef.getContext('2d');

      // Рендеринг графика
      this.priceMovementChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `Цена закрытия для ${ticker}`,
            data: data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            x: {
            //   type: 'time',
            //   time: {
            //     parser: 'YYYY-MM-DD',
            //     tooltipFormat: 'YYYY-MM-DD',
            //     unit: 'day'
            //   },
              title: {
                display: true,
                text: 'Дата'
              }
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Цена закрытия'
              }
            }
          }, 
           plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true, // Включает масштабирование колесиком мыши
                },
                pinch: {
                  enabled: true, // Включает масштабирование щипком
                },
                mode: 'x', // Масштабирование будет по оси X
              },
              pan: {
                enabled: true, // Включает панорамирование
                mode: 'x', // Панорамирование будет по оси X
              },
            },
          },
        }
      });
    })
  },
    handleChartClick(event, chartIndex) {
      const chart = this.charts[chartIndex];
      if (!chart) {
        console.error(`График с индексом ${chartIndex} не найден.`);
        return;
      }

      const activeElements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
      this.selectedTickerData = true
      // console.log(this.selectedTickerData, this.$refs['priceChangeChart-0'])

      if (activeElements.length > 0) {
        const firstElement = activeElements[0];
        const label = chart.data.labels[firstElement.index];
        const value = chart.data.datasets[firstElement.datasetIndex].data[firstElement.index];

        console.log(`Выбрана бумага: ${label}, изменение цены: ${value}%`);
        
        this.renderPriceMovementChart(label, chartIndex);
        // this.renderGaussaChart(label, chartIndex);
      }
    },
    prepareChartData(data) {
      return Object.entries(data).map(([, portfolio]) => {
        const labels = [];
        const chartData = [];     
        Object.entries(portfolio.tickers).forEach(([ticker, tickerData]) => {
          if (!tickerData || tickerData.length === 0) {
            console.error(`Ticker data for ${ticker} is empty or not defined`);
            return;
          }

          console.log(tickerData[tickerData.length - 1], tickerData) // Строка выводит разные варинаты данных. Надо сделать преобразование 
          const openPrice = tickerData[0].open.num / Math.pow(10, tickerData[0].open.scale);
          const closePrice = tickerData[tickerData.length - 1].close.num / Math.pow(10, tickerData[tickerData.length - 1].close.scale);
          const priceChangePercent = ((closePrice - openPrice) / openPrice) * 100;
          labels.push(ticker);
          chartData.push(priceChangePercent.toFixed(2));
        });

        if (labels.length === 0 || chartData.length === 0) {
          console.error('No data to display the histogram.');
          return;
        }

        console.log(labels, chartData)
        return { labels, chartData };
      });
    },
    renderAllCharts() {
      if (!this.portfoliosChartData || this.portfoliosChartData.length === 0) {
        console.error('No valid chart data available for rendering');
        return;
      }
      // Удаляем все предыдущие графики
      this.charts.forEach(chart => chart.destroy());
      this.charts = [];

      this.$nextTick(() => {
        
        this.portfoliosChartData.forEach((portfolio, index) => {
          console.log(this.$refs);
          const refName = 'priceChangeChart-' + index;
          const canvasRef = this.$refs[refName][0];
          console.log(`Ref for ${refName}:`, canvasRef);
          if (canvasRef && typeof canvasRef.getContext === 'function') {
            const ctx = canvasRef.getContext('2d');
            console.log('port lables '+portfolio.labels)
            const chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: portfolio.labels,
                datasets: [{
                  label: 'Изменение цены (%)',
                  data: portfolio.chartData,
                  backgroundColor: portfolio.chartData.map(value => value >= 0 ? 'green' : 'red'),
                }]
              },
              options: {
                indexAxis: 'y',
                scales: {
                  x: {
                    beginAtZero: true
                  }
                }
              }
            });
            // canvasRef.addEventListener('click', (event) => {
            //   this.handleChartClick(event, index);
            // });
            this.charts.push(chart);
          } else {
            console.error(`Canvas ref '${refName}' not found.`);
          }
        });
      })
    }
  },
  beforeUnmount() {
    // Уничтожаем все графики при уничтожении компонента
    this.charts.forEach(chart => chart.destroy());
    if (this.priceMovementChart) {
      this.priceMovementChart.destroy();
    }
  }
}
</script>
