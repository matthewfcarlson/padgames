import Vue from 'vue'
//import VueCompositionAPI from '@vue/composition-api'
import router from "./router"
import App from "./App.vue"
import axios, { AxiosStatic } from 'axios';
import { store } from './store';

Vue.config.productionTip = false

// setup axios
axios.defaults.baseURL = 'http://localhost:3000'; // TODO: figure out what our URL is
Vue.prototype.$axios = axios;
declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosStatic;
  }
}

// setup vue
new Vue({
  router,
  store:store,
  render: h => h(App)
}).$mount("#app")
