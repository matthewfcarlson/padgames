import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
Vue.config.productionTip = false;
new Vue({
    router: router,
    render: function (h) { return h(App); },
    mounted: function () { return document.dispatchEvent(new Event("x-app-rendered")); },
}).$mount("#app");
//# sourceMappingURL=index.js.map