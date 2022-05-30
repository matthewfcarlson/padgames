import NotFound from "../views/404.vue";
import AccessDenied from "../views/403.vue";
import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: NotFound,
  },
  {
    path: "/",
    name: "Home",
    component: AccessDenied,
    meta: {
      requiresLogin:true
    } 
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

// router.beforeEach((to, from, next) => {
//   const toNeedsLogin = to.matched.some((record) => record.meta.requiresLogin);
//   const fromNeedsLogin = from.matched.some((record) => record.meta.requiresLogin);
//   if (toNeedsLogin && !store.getters.loggedIn) {
//     if (fromNeedsLogin) router.push({ name: 'Login' });
//     return;
//   }
//   next() // does not require auth, make sure to always call next()!
// });
// router.afterEach((to,from)=>{
//   document.title = "Padgames " + (to.name || '');
// })

export default router
