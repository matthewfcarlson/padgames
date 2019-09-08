// go through the ../../games folder and copy all of the route.json information.
//var glob = require("glob");
// This was attempted with virtual modules but it didn't lead to good results
// Example routes
// import * as Route1 from "./src/views/Home.vue";
// export default  [
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
const path = require("path");
const outputFile = "./client/src/routes.dynamic.ts";

if (fs.existsSync(outputFile)) { //TODO figure out if we're in development- if we're doing prod we should be running this every time
  console.log("Skipping generation of dynamic routes to speed up compile time");
  module.exports = -1;
} else {
  const imports = [];
  const routes = [];
  console.log("Generating dynamic routes");
  // 1. glob the file system looking for *routes.json
  let glob_options = {
    ignore: "./node_modules/*"
  };
  let files = glob.sync("./**/*routes.json", glob_options);
  let all_routes = [];
  const output_dir = path.dirname(path.resolve(outputFile));
  // 2. Read in each file and add to the list of routes
  for (var file_index in files) {
    const file_path = files[file_index];
    const routes_text = fs.readFileSync(file_path)
    const routes_json = JSON.parse(routes_text);
    const directory = path.dirname(file_path);
    console.log(directory);
    //resolve the various parts of the file
    for (var route_index in routes_json) {
      if (!("priority" in routes_json[route_index])) routes_json[route_index]["priority"] = 0;
      if (!("isGame" in routes_json[route_index])) routes_json[route_index]["isGame"] = false;
      if (!("chunk" in routes_json[route_index])) routes_json[route_index]["chunk"] = false;
      //remap directory
      let route_comp_path = path.join(directory, routes_json[route_index]["component"]);
      let route_comp_rel_path = path.relative(output_dir, route_comp_path);
      if (route_comp_rel_path[0] != ".") route_comp_rel_path = "./"+ route_comp_rel_path;
      console.log(route_comp_rel_path);
      console.log(route_comp_rel_path.replace(/\\/g, "/"));

      routes_json[route_index]["component"] = route_comp_rel_path.replace(/\\/g, "/");
    }
    all_routes = all_routes.concat(routes_json);
  }

  // 3. Sort routes based on priorirty
  const sorted_routes = all_routes.sort((a, b) => a["priority"] < b["priority"]);

  // 4. Figure out the import path and if it has a chunk name
  for (var route_index in sorted_routes) {
    const route = sorted_routes[route_index];
    const route_path = route["path"];
    const route_name = route["name"];
    const route_comp = route["component"]; //TODO resolve path relative to the folder?
    const route_id = "Route" + route_index;
    const route_isGame = route["isGame"];
    var comp_load = "component: " + route_name;

    if (route['chunk']) {
      // if we're going to lazy load this one
      comp_load = 'component: () => import(/* webpackChunkName: "' + route_name + '" */ "' + route_comp + '")'
    }
    else {
      imports.push('import ' + route_name + ' from "' + route_comp + '"')
    }

    var route_texts = [];
    route_texts.push('path: "' + route_path + '"');
    route_texts.push('name: "' + route_name + '"');
    //route_texts.push('isGame: ' + route_isGame);
    route_texts.push(comp_load);
    var route_text = "{\n  " + route_texts.join(",\n  ") + "\n}";
    routes.push(route_text);
  }
  console.log(imports);
  console.log(routes);
  // 5. Generate the strings based on the inputs
  var code = imports.join("\n");
  code += "\n\nexport default  [";
  code += routes.join(",\n");
  code += "];"

  // 6. output the file
  fs.writeFile(outputFile, code, err => {
    if (err) throw err;
    console.log("Saved dynamic route file to ", outputFile);
  });

  module.exports = routes.length;
}
