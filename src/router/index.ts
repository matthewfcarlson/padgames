import NotFound from "../pages/404.vue";
import AccessDenied from "../pages/403.vue";
import About from "../pages/About.vue";
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresLogin:true
    } 
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/403",
    name: "403",
    component: AccessDenied,
  },
  
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

import { useAuthStore } from "@/store/auth";

router.beforeEach((to, from, next) => {
  const toNeedsLogin = to.matched.some((record) => record.meta.requiresLogin);
  const fromNeedsLogin = from.matched.some((record) => record.meta.requiresLogin);
  const store = useAuthStore();
  if (toNeedsLogin && !store.loggedIn) {
    if (fromNeedsLogin) router.push({ name: 'Login' });
    return;
  }
  next() // does not require auth, make sure to always call next()!
});
router.afterEach((to,from)=>{
  document.title = "Padgames " + (to.name?.toString() || '');
})

export default router
