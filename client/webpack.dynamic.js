// go through the ../../games folder and copy all of the route.json information.
//var glob = require("glob");
// This was attempted with virtual modules but it didn't lead to good results
// Example routes
// [
//   {
//     path: "/",
//     name: "home",
//     component: Home
//   },
//   {
//     path: "/about",
//     name: "about",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
//   },
//   {
//     path: "/contact",
//     name: "contact",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "contact" */ "./views/Contact.vue")
//   },
//   {
//     path: "*",
//     component: () => import(/* webpackChunkName: "404" */ "./views/404.vue")
//   }
// ];
const fs = require('fs');
const glob = require("glob");
const imports = [];
const routes = []


outputFile = "./client/routes.dynamic.ts";
fs.writeFile(outputFile, code, (err)=> {
  if (err) throw err;
  console.log("Saved directory file to ", outputFile);
} )

module.exports = 2;
