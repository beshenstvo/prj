// plugins/vuetify.js
import 'vuetify/styles' // Global CSS импорт
import { createVuetify } from 'vuetify'
import DayJsAdapter from '@date-io/dayjs'

export default createVuetify({
    date: {
      adapter: DayJsAdapter,
    }
  })// Replaces new Vuetify(...)



