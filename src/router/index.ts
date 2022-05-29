import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import NotFound from "../views/404.vue";
import AccessDenied from "../views/403.vue";
import { store } from "@/store";

// Get the store and check if we're logged in

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: AccessDenied
  },
//   {
//     path: "/award",
//     name: "Award",
//     component: () => import(/* webpackChunkName: "award" */ "../views/Award.vue"),
//     meta: {
//       requiresAdmin:true
//     } 
//   },
//   {
//     path: "/about",
//     name: "About",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
//   },
//   {
//     path: "/progress",
//     name: "Progress",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "progress" */ "../views/Progress.vue")
//   },
//   {
//     path: "/start",
//     name: "Start Game",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "start" */ "../views/StartGame.vue"),
//     meta: {
//       requiresAdmin:true
//     },
//   },
//   {
//     path: "/login",
//     name: "Login",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue")
//   },
//   {
//     path: "/403",
//     name: "403",
//     component: AccessDenied,
//   },
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

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAdmin)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     //TODO: figure out what to do
//     if (!store.getters.loggedIn) {
//       next({ name: 'Login' });
//       return;
//     }
//     if (!store.getters.isUserAdmin) {
//       next({ name: '403'});
//       return;
//     }

//   }
//   next() // does not require auth, make sure to always call next()!
// });

export default router
