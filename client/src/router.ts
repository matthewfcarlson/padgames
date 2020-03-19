import Vue from "vue";
import Router from "vue-router";
import {RouteConfig} from "vue-router";
import { DynamicRoutes } from "./routes.dynamic";
import { Logger } from "../../common/util/logger";
Vue.use(Router);

const logger = new Logger();

const ExternalRoutes: RouteConfig[] = [
  {
    path: "/donate",
    name: "Donate",
    beforeEnter() {
      const url = "https://ko-fi.com/padgames";
      // window.history.replaceState({}, "Donate", url);
      location.href = url;
    }
  },
  {
    path: "/github", // I don't like this, it makes it hard.
    name: "GitHub",
    beforeEnter() {
      const url = "https://github.com/matthewfcarlson/padgames";
      location.href = url;
    }
  },
  {
    path: "/issues",
    name: "Issues",
    beforeEnter() {
      const url = "https://github.com/matthewfcarlson/padgames/issues";
      location.href = url;
    }
  },
];
const AllRoutes = ExternalRoutes.concat(DynamicRoutes);

const router = new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: AllRoutes
});

export default router;
