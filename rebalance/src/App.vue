<template>
  <div>
    <!-- <h1>Created by Ruf</h1> -->
    <div class="container d-flex justify-content-end mb-2" style="width: 50%">
      <button class="btn btn-outline-success" @click="addPortfolio">Создать портфель</button>
    </div>

    <div class="container" style="width: 50%">
       <div v-if="portfolios.length == 0" class="alert alert-danger pt-4 pb-4">
          Создайте портфель
        </div>
      <div v-for="(portfolio, index) in portfolios" :key="index" class="accordion mb-2">
        <div class="d-flex justify-content-between"  @click="portfolio.isVisible = !portfolio.isVisible">
          <div><h1>Портфель #{{ index + 1 }}</h1></div>
          <div style="align-self: center;">
            <button class="show-hide">
              <i v-if="portfolio.isVisible" class="fa-solid fa-minus"></i>
              <i v-else class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
    
        <div class="panel" v-if="portfolio.isVisible">
          <div  style="align-self: center;">
            <div class="d-flex justify-content-start form-check">
              <div><input class="form-check-input" type="radio" name="futuresOrStocks" id="futures" v-model="futuresOrStocks" value="futures"></div>
              <div><label class="form-check-label" for="futures">Фьючерсы</label></div>
            </div>
            
            <div class="d-flex justify-content-start form-check">
              <div><input class="form-check-input" type="radio" name="futuresOrStocks" id="stocks" v-model="futuresOrStocks" value="stocks"></div>
              <div><label class="form-check-label" for="stocks">Акции</label></div>
            </div>
          </div>
        <form>
          <div style="text-align: start;"><label for="exampleInputPassword1" class="form-label">Выберите бумагу</label></div>
          <div class="input-group mb-3" v-if="futuresOrStocks == 'stocks'">
            <select class="form-select" id="inputGroupSelect02" multiple size=10 v-model="portfolio.tickers">
              <option value="AGRO">AGRO-гдр</option>
              <option value="ALRS">АЛРОСА ао</option>
              <option value="AFLT">Аэрофлот</option>
              <option value="VTBR">ВТБ ао</option>
              <option value="GAZP">ГАЗПРОМ ао</option>
              <option value="GMKN">ГМКНорНик</option>
              <option value="GLTR">GLTR-гдр</option>
              <option value="POSI">iПозитив</option>
              <option value="QIWI">iQIWI</option>
              <option value="IRAO">ИнтерРАОао</option>
              <option value="LKOH">ЛУКОЙЛ</option>
              <option value="MGNT">Магнит ао</option>
              <option value="CBOM">МКБ ао</option>
              <option value="MAGN">ММК</option>
              <option value="MOEX">МосБиржа</option>
              <option value="NLMK">НЛМК ао</option>
              <option value="NVTK">Новатэк ао</option>
              <option value="OZON">OZON-адр</option>
              <option value="PHOR">ФосАгро ао</option>
              <option value="PIKK">ПИК ао</option>
              <option value="PLZL">Полюс</option>
              <option value="POLY">Polymetal</option>
              <option value="ROSN">Роснефть</option>
              <option value="RTKM">Ростел -ао</option>
              <option value="RUAL">РУСАЛ ао</option>
              <option value="SBER">Сбербанк</option>
              <option value="SBERP">Сбербанк-п</option>
              <option value="SELG">Селигдар</option>
              <option value="SNGS">Сургнфгз</option>
              <option value="SNGSP">Сургнфгз-п</option>
              <option value="TATN">Татнфт 3ао</option>
              <option value="TATNP">Татнфт 3ап</option>
              <option value="TCSG">TCS-гдр</option>
              <option value="TRNFP">Транснф ап</option>
              <option value="UPRO">Юнипро ао</option>
              <option value="YNDX">Yandex clA</option>
            </select>
          </div>
          <div class="input-group mb-3" v-if="futuresOrStocks == 'futures'">
            <select class="form-select" id="inputGroupSelect02" multiple size=10 v-model="portfolio.tickers">
              <option value="SiZ3">Фьючерс на доллар США</option>
              <option value="RiZ3">ФЧС на Индекс РТС</option>
              
            </select>
          </div>
          <div style="text-align: start;"><label class="form-label">Интервал</label></div>
          <div class="input-group mb-3">
            <select class="form-select" id="inputGroupSelect02" v-model="portfolio.interval">
              <option value="W1" selected>Недельный</option>
              <option value="D1">Дневной</option>
            </select>
          </div>
          <div class="mb-3">
            <div style="text-align: start;"><label class="form-label">Торговые дни в году</label></div>
            <div><input type="text" class="form-control" v-model="portfolio.tradingDays"></div>
          </div>
          <div class="mb-3">
            <div style="text-align: start;"><label >Период дней для HV</label></div>
            <div><input type="text" class="form-control" v-model="portfolio.hv"></div>
          </div>
          <div class="d-flex justify-content-around">
              <div class="mb-3 flex-fill me-4">
                <div style="text-align: start;"><label class="form-label">Дата начала</label></div>
                <div><VueDatePicker v-model="portfolio.startDate" :flow="flow" :enable-time-picker="false" :format="format"></VueDatePicker></div>
              </div>
              <div class="mb-3 flex-fill">
                <div style="text-align: start;"><label class="form-label">Дата окончания</label></div>
                <div><VueDatePicker v-model="portfolio.endDate" :flow="flow" :enable-time-picker="false" :format="format"></VueDatePicker></div>
              </div>
          </div>
        </form>
        </div>
      
        <div class="d-flex justify-content-end"><button class="btn btn-outline-danger mt-2" @click="removePortfolio(index)"><i class="fa-solid fa-trash"></i></button></div>
      </div>
    </div>
    <button v-if="portfolios.length > 0" type="submit" class="btn btn-outline-primary" @click="collectData()" >Подгрузить данные</button>

    <hr>
    <div class="navbar-nav d-flex flex-row justify-content-center">
      <router-link to="/" class="nav-link m-2">Гистограмма изменения цены</router-link>
      <router-link to="/hv" class="nav-link m-2">График исторической волатильности</router-link>
      <router-link to="/stat" class="nav-link m-2">Статистика</router-link>
      <router-link to="/rebalance" class="nav-link m-2">Ребалансировка портфеля</router-link>
    </div>
  <div>
      <router-view></router-view>
  </div>
  </div>  
</template>


<script setup>
import { ref } from 'vue';

const flow = ref(['month', 'year', 'calendar']);
const format = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
</script>

<script>
import axios from "axios"
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: { VueDatePicker },
  data() {
    return {
      portfolios: [],
      futuresOrStocks: 'stocks',
      isDataLoaded: false
    }
  },
  name: 'App', 
  methods: {
    addPortfolio() {
      this.portfolios.push({
        isVisible: true,
        tickers: [],
        interval: 'D1', 
        tradingDays: 250,
        hv: 30, 
        startDate: new Date().toISOString().substr(0, 10), 
        endDate: new Date().toISOString().substr(0, 10),
      });
    },
    removePortfolio(index) {
      this.portfolios.splice(index, 1);
    },
    async collectData() {
      try {
      if (!this.portfolios.some(portfolio => 
        portfolio.tickers.length > 0 &&
        portfolio.interval &&
        portfolio.startDate &&
        portfolio.endDate)) {
          alert("Пожалуйста, убедитесь, что хотя бы один портфель полностью заполнен.");
          return;
      }
      console.log(this.portfolios.map(portfolio => {console.log("даты : "+ portfolio.startDate, portfolio.endDate)}))
      let allRequests = [];

      this.portfolios.forEach((portfolio, portfolioIndex) => {
        portfolio.tickers.forEach(ticker => {
          // Разбиваем запросы на интервалы по 365 дней
          let currentDate = new Date(portfolio.startDate);
          let endDate = new Date(portfolio.endDate);
          while (currentDate <= endDate) {
            let nextDate = new Date(currentDate);
            nextDate.setFullYear(nextDate.getFullYear() + 1); // Добавляем 1 год
            nextDate.setDate(nextDate.getDate() - 1); // Отнимаем 1 день, чтобы не включать первый день следующего интервала
            if (nextDate > endDate) {
              nextDate = endDate;
            }

            if(this.futuresOrStocks == 'stocks') {
              const requestUrl = `http://localhost:3000/api/day-candles?SecurityBoard=TQBR&SecurityCode=${ticker}&TimeFrame=${portfolio.interval}&Interval.From=${currentDate.toISOString().split('T')[0]}&Interval.To=${nextDate.toISOString().split('T')[0]}`;

              const request = axios.get(requestUrl)
                .then(response => ({
                  portfolioIndex: portfolioIndex,
                  hv_period: portfolio.hv,
                  trading_days: portfolio.tradingDays,
                  ticker: ticker,
                  data: response.data.data.candles
                }))
                .catch(error => ({
                  portfolioIndex: portfolioIndex,
                  ticker: ticker,
                  error: error
                }));

              allRequests.push(request);
              currentDate = new Date(nextDate);
              currentDate.setDate(currentDate.getDate() + 1); // Начинаем следующий интервал со следующего дня
            } else {
              const requestUrl = `http://localhost:3000/api/day-candles?SecurityBoard=FUT&SecurityCode=${ticker}&TimeFrame=${portfolio.interval}&Interval.From=${currentDate.toISOString().split('T')[0]}&Interval.To=${nextDate.toISOString().split('T')[0]}`;
              // название тикера + месяц код его + год текущий или след в зависимости от сегодняшнего числа для фьючерса

              console.log(requestUrl)
              const request = axios.get(requestUrl)
                .then(response => ({
                  portfolioIndex: portfolioIndex,
                  hv_period: portfolio.hv,
                  trading_days: portfolio.tradingDays,
                  ticker: ticker,
                  data: response.data.data.candles
                }))
                .catch(error => ({
                  portfolioIndex: portfolioIndex,
                  ticker: ticker,
                  error: error
                }));

              allRequests.push(request);
              currentDate = new Date(nextDate);
              currentDate.setDate(currentDate.getDate() + 1); // Начинаем следующий интервал со следующего дня
            }
          }
        })
      })

      try {
        const results = await Promise.all(allRequests);
        const structuredData = results.reduce((acc, result) => {
          if (!acc[result.portfolioIndex]) {
            acc[result.portfolioIndex] = {
              portfolioIndex: result.portfolioIndex,
              hv_period: result.hv_period,
              trading_days: result.trading_days,
              tickers: {}
            };
          }

          // Если для тикера уже есть данные, объединяем массивы
          if (acc[result.portfolioIndex].tickers[result.ticker]) {
            acc[result.portfolioIndex].tickers[result.ticker] = acc[result.portfolioIndex].tickers[result.ticker].concat(result.data);
          } else {
            acc[result.portfolioIndex].tickers[result.ticker] = result.data;
          }

          return acc;
        }, {});
        
        console.log("Структурированные данные:", structuredData);
        
        await this.$store.dispatch('fetchChartData', structuredData);

        // // Переход к маршруту гистограммы
        // this.$router.push({ name: 'Home' });

      } catch (error) {
        console.error('Ошибка при выполнении запросов:', error);
      }
    this.isDataLoaded = true;
    } catch (error) {
      console.error('Error: ' + error)
    }
    },
  },
}
</script>

<style>
.router-link-active {
  border-bottom: #2c3e50 2px solid;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.accordion {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  transition: 0.4s;
  border-radius: 1%;
}

.show-hide {
  border: none;
  background-color: transparent;
  font-size: 2em;
  font-weight: bold;
}




</style>
