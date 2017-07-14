import * as express from "express";
import * as path from "path";
import * as glob from 'glob';
import * as fs from 'fs';

import dotenv = require("dotenv");
require('./config/alias')

dotenv.config({
  silent: true,
  path: path.join(__dirname, "../.env")
});
const environment = process.env.NODE_ENV;
import expressConfig from "./config/express";
import controllerRoutes from "./config/controllerRoutes";
import serverController from "./config/serverController";
import webpackHotReload from "./config/middleware/webpackHotReload";

const server: express.Application = express();
var port = process.env.PORT || 3000;

expressConfig(server);

var rootPath = path.join(__dirname, '../../')
if (environment === "development") {
  console.log("---- DEVELOPMENT ENVIRONMENT ----")
  webpackHotReload(server, path.join(rootPath, 'webpack.config.js'));
  server.use('/src', express.static(path.join(rootPath, 'src')));
}


const appPath = path.join(rootPath, "/build/public");
var publicPath = path.join(rootPath, "public");
//server.use("/public", express.static(publicPath));
server.use('/public', express.static(appPath));



//controllerRoutes(server, path.join(__dirname, "./controllers"));


//since reactRouter uses wild card maching it should be the last controller in registry
serverController(server);
server.listen(port, () => {
  console.log(`✓' Express server listening on port ${port}.`);
  clenupHotUpdateFiles();
});


function clenupHotUpdateFiles() {
  glob(appPath + "/*.hot-update.*", (err, files) => {
     files.forEach(function(item,index,array){
          //console.log(item + " found");
        fs.unlink(item, function(err){
              if (err) throw err;
              console.log(item + " deleted");
        });
     });
  })
}

export default server;