import Vue from "vue";
import Router from "vue-router";
import DynamicRoutes from "./routes.dynamic";
import { Logger } from "../../common/util/logger";
Vue.use(Router);

const logger = new Logger();
const Routes = DynamicRoutes;
logger.info(Routes);

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: Routes
});
