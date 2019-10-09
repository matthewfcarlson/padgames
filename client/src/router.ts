import Vue from "vue";
import Router from "vue-router";
import { AllRoutes } from "./routes.dynamic";
import { Logger } from "../../common/util/logger";
Vue.use(Router);

const logger = new Logger();

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: AllRoutes
});
