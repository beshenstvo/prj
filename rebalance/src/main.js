import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader


createApp(App).use(vuetify).use(router).use(store).mount('#app')
