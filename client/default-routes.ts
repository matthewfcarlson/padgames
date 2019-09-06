import Home from "./src/views/Home.vue";
export default  [
      {
        path: "/",
        name: "home",
        component: Home
      },
      {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ "./src/views/About.vue")
      },
      {
        path: "/contact",
        name: "contact",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "contact" */ "./src/views/Contact.vue")
      },
      {
        path: "*",
        component: () => import(/* webpackChunkName: "404" */ "./src/views/404.vue")
      }
];