import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import NotFound from "../views/404.vue";
import AccessDenied from "../views/403.vue";
import { store } from "@/store";
// Get the store and check if we're logged in

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/403",
    name: "403",
    component: AccessDenied,
  },
  {
    path: '*',
    name: '404',
    component: NotFound
  },
  
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const toNeedsLogin = to.matched.some((record) => record.meta.requiresLogin);
  const fromNeedsLogin = from.matched.some((record) => record.meta.requiresLogin);
  if (toNeedsLogin && !store.getters.loggedIn) {
    if (fromNeedsLogin) router.push({ name: 'Login' });
    return;
  }
  next() // does not require auth, make sure to always call next()!
});
router.afterEach((to,from)=>{
  document.title = "Padgames " + (to.name || '');
})

export default router
