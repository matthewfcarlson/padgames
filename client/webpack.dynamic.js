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
const fs = require("fs");
const glob = require("glob");
const imports = [];
const routes = [];
const inputFile = "./client/default-routes.ts";
const outputFile = "./client/src/routes.dynamic.ts";

let code = "";
if (fs.existsSync(outputFile)) { //TODO figure out if we're in development- if we're doing prod we should be running this every time
  console.log("Skipping generation of dynamic routes to speed up compile time");
  module.exports = -1;
} else {
  console.log("Generating dynamic routes");
  // 1. glob the file system looking for *routes.json
  let glob_options = {
    ignore: "./node_modules/*"
  };
  let files = glob.sync("./**/*routes.json", glob_options);
  console.log(files);
  //throw new Error("Stop here");  
  // 2. Read in each file and add to the list of routes

  // 3. Figure out the import path and if it has a chunk name

  // 4. Generate the strings based on the inputs

  // 5. output the file
  fs.writeFile(outputFile, code, err => {
    if (err) throw err;
    console.log("Saved directory file to ", outputFile);
  });

  module.exports = files.length;
}
