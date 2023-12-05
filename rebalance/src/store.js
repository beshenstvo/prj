// import { createStore } from 'vuex';

// export default createStore({
//   state() {
//     return {
//       chartData: [],
//     };
//   },
//   mutations: {
//     setChartData(state, data) {
//       state.chartData = data;
//     },
//   },
//   actions: {
//     fetchChartData({ commit }, data) {
//       commit('setChartData', data);
//     },
//   },
// });



import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage // или window.sessionStorage
});

export default createStore({
  state() {
    return {
      chartData: [],
    };
  },
  mutations: {
    setChartData(state, data) {
      state.chartData = data;
    },
  },
  actions: {
    fetchChartData({ commit }, data) {
      commit('setChartData', data);
    },
  },
  getters: {
    monthlyStatistics: (state) => {
      let stats = {};
      if (Array.isArray(state.chartData)) {
        state.chartData.forEach((data) => {
          const month = new Date(data.date).getMonth();
          if (!stats[month]) {
            stats[month] = { increase: 0, decrease: 0, total: 0, count: 0 };
          }
          const change = data.close - data.open;
          stats[month].total += change;
          stats[month].count++;
          if (change > 0) {
            stats[month].increase++;
          } else if (change < 0) {
            stats[month].decrease++;
          }
        });

        for (let month in stats) {
          stats[month].averageChange = stats[month].total / stats[month].count;
        }
      }
        return stats;

    }
  },
  plugins: [vuexLocal.plugin]
});
