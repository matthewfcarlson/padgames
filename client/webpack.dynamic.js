// go through the ../../games folder and copy all of the route.json information.
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
const routeOutputFile = "./client/src/routes.dynamic.ts";
const gameOutputFile = "./games/games.dynamic.ts";
const gamesFolder = "./games";

if (fs.existsSync(routeOutputFile) && fs.statSync(routeOutputFile).size > 0 && fs.existsSync(gameOutputFile)) { //TODO figure out if we're in development- if we're doing prod we should be running this every time
  console.log(fs.statSync(routeOutputFile).size);
  console.log("Skipping generation of dynamic routes to speed up compile time");
  module.exports = -1;
} 
else {
  const imports = [];
  const routes = [];
  const games = [];
  const game_info = [];
  imports.push("import {RouteConfig} from \"vue-router\";")
  console.log("Generating dynamic routes");
  // 1. glob the file system looking for *routes.json
  let glob_options = {
    ignore: "./node_modules/*"
  };
  let files = glob.sync("./**/*routes.json", glob_options);
  let all_routes = [];
  const output_dir = path.dirname(path.resolve(routeOutputFile));
  // 2. Read in each file and add to the list of routes
  for (var file_index in files) {
    const file_path = files[file_index];
    const routes_text = fs.readFileSync(file_path)
    const routes_json = JSON.parse(routes_text);
    const directory = path.dirname(file_path);
    //resolve the various parts of the file
    for (var route_index in routes_json) {
      if (!("priority" in routes_json[route_index])) routes_json[route_index]["priority"] = 0;
      if (!("isGame" in routes_json[route_index])) routes_json[route_index]["isGame"] = false;
      if (!("chunk" in routes_json[route_index])) routes_json[route_index]["chunk"] = false;
      if (!("ready" in routes_json[route_index])) routes_json[route_index]["ready"] = true;
      if (!("routeName" in routes_json[route_index])) routes_json[route_index]["routeName"] = routes_json[route_index]["name"];
      //remap directory
      let route_comp_path = path.join(directory, routes_json[route_index]["component"]);
      let route_comp_rel_path = path.relative(output_dir, route_comp_path);
      let route_dir_rel_path = path.relative(output_dir, directory);
      let route_game_rel_path = path.relative(path.resolve(gamesFolder), directory);
      if (route_comp_rel_path[0] != ".") route_comp_rel_path = "./" + route_comp_rel_path; 

      routes_json[route_index]["component"] = route_comp_rel_path.replace(/\\/g, "/");
      routes_json[route_index]["relative_dir"] = route_dir_rel_path.replace(/\\/g, "/");
      routes_json[route_index]["game_relative_dir"] = route_game_rel_path.replace(/\\/g, "/");
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
    const route_path_name = route["routeName"];
    const route_display_name = route["displayName"] || route_name;
    const route_comp = route["component"]; //TODO resolve path relative to the folder?
    const route_id = "Route" + route_index;
    const route_isGame = route["isGame"];
    var comp_load = "component: " + route_name;

    if (route['chunk']) {
      // if we're going to lazy load this one
      comp_load = 'component: () => import(/* webpackChunkName: "' + route_name + '" */ "' + route_comp + '")'
    }
    else {
      const import_statement = 'import ' + route_name + ' from "' + route_comp + '";'
      // Check to make sure it isn't already in there
      if (imports.indexOf(import_statement) == -1) imports.push(import_statement);
    }

    var route_texts = [];
    route_texts.push('path: "' + route_path + '"');
    route_texts.push('name: "' + route_path_name + '"');
    //route_texts.push('isGame: ' + route_isGame);
    route_texts.push(comp_load);

    var route_color = (route["color"] || false);
    var props = { };
    if (route_color) props["color"] = route_color;
    
    if (route_isGame) {
      var game_texts = [];
      var game_ready = route["ready"];
      let logo_path = path.join(route["relative_dir"], route["gameLogo"] || "logo.svg").replace(/\\/g, "/");
      
      var game_description = route["description"] || "";
      var game_color = route_color || "#226699";
      
      
      game_texts.push('name: "' + route_display_name + '"');
      game_texts.push('id: "' + route_name + '"');
      game_texts.push('ready: '+ game_ready)
      game_texts.push('url: "' + route_path + '"');
      game_texts.push('color: "' + game_color + '"');
      game_texts.push('description: "' + game_description + '"');
      game_texts.push('logo: require("./' + logo_path + '")');

      var game_data = game_texts.slice(0, -2);
      
      var game_text = "{\n  " + game_texts.join(",\n  ") + "\n}";
      var game_data_text = "{\n  " + game_data.join(",\n  ") + "\n}";
      games.push(game_text);
      game_info.push(game_data_text);
    }
    route_texts.push("props: "+JSON.stringify(props));

    // finish the route
    var route_text = "{\n  " + route_texts.join(",\n  ") + "\n}";
    routes.push(route_text);
  }
  // 5. Generate the strings based on the inputs
  var code_array = imports;
  code_array.push("const DynamicRoutes: RouteConfig[] = [");
  code_array.push(routes.join(",\n"));
  code_array.push("];")
  code_array.push("const AllGames = [");
  code_array.push(games.join(",\n"));
  code_array.push("];");
  
  code_array.push("export {DynamicRoutes, AllGames};");
  const code = code_array.join("\n");

  //TODO figure out what to do the games vs the routes

  // 6. output the file
  fs.writeFile(routeOutputFile, code, err => {
    if (err) throw err;
    console.log("Saved dynamic route file to ", routeOutputFile);
  });

  var game_code_array = [];
  game_code_array.push("const AllGames = [");
  game_code_array.push(game_info.join(",\n"));
  game_code_array.push("];");
  game_code_array.push("export {AllGames};");
  const game_code = game_code_array.join("\n");
  
  fs.writeFile(gameOutputFile, game_code, err => {
    if (err) throw err;
    console.log("Saved dynamic game info file to ", gameOutputFile);
  });

  module.exports = routes.length;
}
