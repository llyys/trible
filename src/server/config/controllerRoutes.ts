
import * as fs from "fs";
export default (app, routePath) => {
  processFlatRoutePath(app, routePath);
};

const jsFile = file => /\.js$/i.test(file);

function processFlatRoutePath(app, routePath) {
  fs.readdirSync(routePath).filter(jsFile).forEach(function(file) {
    var route = routePath + "/" + file;
    console.log(`binding ${route}`);
    let module:any = require(route);
    module.default(app);
  });
}

// function processRecursiveRoutePath(app, route_path) {
//   fs.readdirSync(route_path).filter(jsFile).forEach(function(file) {
//     var filepath = route_path + "/" + file;
//     fs.stat(filepath, function(err, stat) {
//       if (stat.isDirectory()) {
//         processRecursiveRoutePath(app, filepath);
//       } else {
//         console.info("Loading route: " + filepath);
//         require(filepath)(app);
//       }
//     });
//   });
// }
